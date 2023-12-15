import { useRoute } from "@react-navigation/native";
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import firebase from '../Config/Index';
import { useEffect, useState } from "react";
const database = firebase.database();
export default function ChatScreen(){
    const route = useRoute();
     const user = firebase.auth().currentUser;
     const [userDetails,setUserDetails] = useState({
      nom: '',
      prenom: '',
      tel: '',
      url: '',
      uid:"",
    })
     useEffect(() => {
      const fetchData = async () => {
        console.log(user);
        const profileRef = database.ref(`profils/${user}`);
        setUserDetails({ ...userDetails, uid: user });
        console.log(userDetails);
    
        try {
          const snapshot = await profileRef.once('value');
          if (snapshot.exists()) {
            console.log('yes');
            const profileData = snapshot.val();
            setUserDetails({ ...profileData, uid: user });
            setIsdefault(true);
            console.log(profileData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }, [user]);
     const { channel } = route.params;
     const groupId = channel.name;
     const [messages, setMessages] = useState([]);
     const [loading, setLoading] = useState(true);
     useEffect(() => {
      const messageRef = database.ref(`publicGroups/${groupId}/messages`).orderByChild('timestamp');
      messageRef.on('value', (snapshot) => {
        const messagesArray = [];
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          
            messagesArray.push({ ...message, id: childSnapshot.key });
        });
        // Sort messages by time or any other relevant criterion
        messagesArray.sort((a, b) => a.time - b.time);
        setMessages(messagesArray);
      });
    
      // Clean up the listener when the component unmounts
      return () => {
        messageRef.off('value');
      };
    });
     const sendMessage = async (pendingMessages) => {
        console.log(messages)
        try {
          // Get the current user
    
          if (user) {
            const currentTime = new Date().toISOString();
            // Create a message object
            const newMessage = {
              text: pendingMessages[0].text,
              senderId: user.uid,
              timestamp: currentTime,
            };
    
            // Reference to the messages node for the specific group
            const messagesRef = firebase.database().ref(`publicGroups/${groupId}/messages`);
    
            // Push the new message to the group's messages
            await messagesRef.push(newMessage);
    
            // Clear the input field
            setMessages('');
          }
        } catch (error) {
          console.error('Error sending message:', error.message);
        }
      };
     function renderBubble(props) {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#d3d3d3'
              }
            }}
          />
        );
      }
    
      return (
        <GiftedChat
          messages={messages}
          onSend={sendMessage}
          user={mapUser(userDetails)}
          renderBubble={renderBubble}
        />
      );
}
function mapUser(user) {
  console.log(user);
    return {
      _id: user.uid,
      name: user.nom,
      avatar: user.url
    };
  }