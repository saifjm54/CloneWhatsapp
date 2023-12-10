import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import firebase from '../Config/Index';
import { useRoute } from '@react-navigation/native';

const database = firebase.database();

export default function Chat() {
    const route = useRoute();
   // const currentid = route.params?.currentid;
    const { currentid, id_user } = route.params;
    const [msg, setMsg] = useState('');
    const [messages , setMessages] = useState([]);
    useEffect(() => {
        const  ref_msg= database.ref('msgS').orderByChild('time');
        if(currentid > id_user){
          room_id = currentid + id_user;

        }else{
          room_id = id_user + currentid;
        }
        const messageRef = ref_msg.child(room_id);

        // Listen for new messages and maintain the order
        messageRef.on('child_added',(snapshot) => {
            const newMessage = snapshot.val();
            setMessages(prevMessages => [...prevMessages,{ ...newMessage,id: snapshot.key}]);
        });

        // Clean up the listener when the component unmounts
        return () => {
            messageRef.off('child_added');
        };
    },[]);

    const sendMessage = () => {
      console.log(currentid);
        const currentTime = new Date().toISOString();
        const ref_msg = database.ref("msgS");
        if(currentid > id_user){
          room_id = currentid + id_user;

        }else{
          room_id = id_user + currentid;
        }
        ref_room = ref_msg.child(room_id); 
        const key = ref_room.push().key;
        ref_room.child(key).set({
          msg: msg,
          sender: currentid,
          receiver: id_user,
          time: currentTime,
          status:false
        });
        setMsg('');
    };
    const renderMessage = ({item}) => {
        const isCurrentUser = item.sender === currentid;
        return(
            <View style={[styles.messageContainer,isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
                <Text>{item.msg}</Text>
            </View>
        );
    };
    return (
        <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          // Remove inverted attribute to display messages at the bottom
        />
          <View style={styles.inputContainer}>
            <TextInput
              value={msg}
              onChangeText={setMsg}
              placeholder="Type your message here"
              style={styles.inputField}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
}
const styles = StyleSheet.create({
    hidden: {
        display: 'none', // Not a valid style property in React Native
        // You can use other styles like this to hide the component
        width: 0,
        height: 0,
        opacity: 0,
        // Or set the visibility to 'hidden'
        visibility: 'hidden',
      },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  messageContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E6E6E6",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
  },avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#007BFF",
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  });
  