import React, { useState,useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker";
import firebase from '../Config/Index';
import { TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
const database=firebase.database();
const MyAccount = (props) => {
  const route = useRoute();
  const currentid = route.params?.currentid; // Access the currentid parameter from route.params
  const [userDetails,setUserDetails] = useState({
    nom: '',
    prenom: '',
    tel: '',
    url: '',
    uid:"",
  })
  const [Isdefault, setIsdefault] = useState(true);
  const [urlImage, seturlImage] = useState('');
  const handleNameChange = (text) => {
    setUserDetails({ ...userDetails, nom: text})
  };

  const handleSurnameChange = (text) => {
    setUserDetails({ ...userDetails, prenom: text});
  };

  const handleEmailChange = (text) => {
    setUserDetails({ ...userDetails, tel: text});
  };
  useEffect(() => {
    const fetchData = async () => {
      console.log(currentid);
      const profileRef = database.ref(`profils/${currentid}`);
      setUserDetails({ ...userDetails, uid: currentid });
      console.log(userDetails);
  
      try {
        const snapshot = await profileRef.once('value');
        if (snapshot.exists()) {
          console.log('yes');
          const profileData = snapshot.val();
          setUserDetails({ ...profileData, uid: currentid });
          setIsdefault(true);
          console.log(profileData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [currentid]);

  const saveUserData = async () => {
    await database.ref(`profils/${currentid}`).set(userDetails);
    console.log('User details updated successfully!');
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
      setUserDetails({ ...userDetails, url: result.assets[0].uri });
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
            value={userDetails.nom}
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
            value={userDetails.prenom}
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
            value={userDetails.tel}
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
        onPress={async() => {await saveUserData()}}
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
