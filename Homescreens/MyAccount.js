import React, { useState ,useEffect} from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';
import img from './../assets/user.png';
import * as ImagePicker from "expo-image-picker";
import firebase from '../Config/Index';
import { TouchableOpacity } from 'react-native-web';
const database=firebase.database();
const MyAccount = () => {
  const [nom, setnom] = useState('');
  const [prenom, setSsetprenom] = useState('');
  const [tel, settel] = useState('');
  const [Isdefault, setIsdefault] = useState(true);
  const [urlImage, seturlImage] = useState('');
  const userId = auth.currentUser.uid;

  const handleNameChange = (text) => {
    setnom(text);
  };

  const handleSurnameChange = (text) => {
    setSsetprenom(text);
  };

  const handleEmailChange = (text) => {
    settel(text);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Assuming auth.currentUser.uid is the user ID
        const snapshot = await database().ref(`profils/${userId}`).once('value');
        const userData = snapshot.val();

        if (userData) {
          setNom(userData.nom);
          setPrenom(userData.prenom);
          setTel(userData.tel);
          setUrlImage(userData.url); // Assuming the URL is stored in the 'url' field
          setIsDefault(false); // Set isDefault to false when the URL is available
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const saveUserData = async () => {
    const url=await uploadimagetofirebase(urlImage);
    const ref_profils=database.ref("profils");
    const ref_un_profile=ref_profils.child("profil" + userId);
    ref_un_profile.set(
        {
            nom:nom,
            prenom:prenom,
            tel:tel,
            url:url
        }
    )
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setIsdefault(false);
      seturlImage(result.assets[0].uri);
    }
  };
  const imageToBlob = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob"; //bufferArray
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    return blob;
  };
  const uploadimagetofirebase=async(uriLocal) => {

    //convertir image to blob
    const blob=await imageToBlob(uriLocal);
    
    
    //upload blob to firebase
    const storage=firebase.storage();
    const ref_mesimages=storage.ref("Mesimages");
    const ref_image=ref_mesimages.child("image"+userId+".jpg");
    ref_image.put(blob);
    //recuperer url
    const url=ref_image.getDownloadURL();
    return url;
    
    
      }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>My Account</Text>

      {/* User Photo */}
      <TouchableOpacity onPress={async() =>{
          await pickImage();
      }}>
      <Image source={Isdefault?require('./../assets/user.png'):{uri:urlImage}} style={styles.userPhoto} />
      </TouchableOpacity>

      {/* Name Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Nom</Text>
          <TextInput
            value={nom}
            onChangeText={handleNameChange}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* Surname Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Prenom</Text>
          <TextInput
            value={prenom}
            onChangeText={handleSurnameChange}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* Email Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Email</Text>
          <TextInput
            value={tel}
            onChangeText={handleEmailChange}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* Save Button */}
      <Button
        mode="contained"
        style={styles.saveButton}
        labelStyle={styles.buttonLabel}
        onPress={saveUserData}
      >
        Save
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userPhoto: {
    width: 130,
    height: 130,
    borderRadius: 75,
    marginBottom: 10,
  },
  card: {
    width: '70%',
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 30,
    marginBottom: 10,
  },
  saveButton: {
    width: '30%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default MyAccount;
