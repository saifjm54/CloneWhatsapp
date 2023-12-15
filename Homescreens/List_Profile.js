import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firebase from '../Config/Index';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import call from 'react-native-phone-call';



const List_Profile = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const currentid = route.params?.currentid; // Access the currentid parameter from route.params
  const database = firebase.database();
  const profilesRef = database.ref('profils');
    const [profilesData, setProfilesData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [phone, setphone] = useState('');
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const args = {
      number: phone, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call 
      skipCanOpen: true // Skip the canOpenURL check
    }
    
    useEffect(() => {
      console.log(currentid);
      console.log(currentid);
      profilesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const profiles = Object.values(data);
          
          // Filter out the profile where uid matches the key
          const filteredProfiles = profiles.filter(profile => profile.uid !== currentid);
          
          setProfilesData(filteredProfiles);
          setFilteredProfiles(filteredProfiles);
        }
      });
      
    }, []);

    const ref_msg = database.ref("msgS");

    // Function to retrieve the count of unread messages
    const countUnreadMessages = async () => {
      try {
        const snapshot = await ref_msg.orderByChild('status')
          .equalTo(false)
          .once('value');
    
        const profilesCopy = [...profilesData]; // Make a copy of the profiles list
    
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          const senderId = message.sender;
          
          // Find the index of the sender in the profiles list
          const senderIndex = profilesCopy.findIndex(profile => profile.uid === senderId);
          if (senderIndex !== -1) {
            profilesCopy[senderIndex].unreadCount = profilesCopy[senderIndex].unreadCount ? profilesCopy[senderIndex].unreadCount + 1 : 1;
          }
        });
    
        // Update the state with the updated profiles list including unread counts
        setProfilesData(profilesCopy);
        console.log(profilesCopy)
      } catch (error) {
        console.error('Error counting unread messages:', error);
      }
    };
    
    useEffect(() => {
      countUnreadMessages();
    }, []);

    const handleSearch = (text) => {
      setSearchQuery(text);
      
      const searchWords = text.toLowerCase().split(' ');
      
      const filtered = profilesData.filter((profile) =>
        searchWords.every((word) =>
          profile.nom.toLowerCase().includes(word) ||
          profile.prenom.toLowerCase().includes(word) ||
          profile.tel.toLowerCase().includes(word)
        )
      );
      
      setFilteredProfiles(filtered);
    };

  const renderProfile = ({ item }) => (
    <View style={styles.profileItem} onClick={()=>{
      alert(`
      Profil Details
      Nom : ${item.nom}
      Prenom : ${item.prenom}
      Tel : ${item.tel}
      `)
    }}>
      <Image source={item.url ?item.url:require('../assets/user.png')} style={styles.profileImage} />

      <View style={styles.profileInfo} >
        <Text>{`${item.nom} ${item.prenom}`}</Text>
        <Text>{item.tel}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {
          console.log(item.uid)

  navigation.navigate('Chat', { currentId: currentid,id_user:item.uid }); // Adjust 'Chat' and 'currentId' as needed
}}>
          <Text>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {
setphone(item.tel);
call(args).catch(console.error)
 // Adjust 'Chat' and 'currentId' as needed
}}>
          <Text>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleDelete = (item) => {
    // Handle delete action for the profile
    console.log('Deleting:', item);
  };

  const handleCall = (item) => {
    // Handle call action for the profile
    console.log('Calling:', item);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search profiles..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredProfiles}
        keyExtractor={(item) => item.id}
        renderItem={renderProfile}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10, // To adjust the space between image and text
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 10,
  },
  profileImage: {
    width: 50, // Adjust width and height as needed
    height: 50, // Adjust width and height as needed
    borderRadius: 25, // For a circular image, set borderRadius to half of the width/height
  },
});

export default List_Profile;
