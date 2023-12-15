import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import firebase from '../Config/Index';
import { useRoute } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform } from 'react-native';

const database = firebase.database();

export default function Chat() {
    const route = useRoute();
   // const currentid = route.params?.currentid;
    const { currentId, id_user } = route.params;
    const [isTyping, setIsTyping] = useState(false);
    const [msg, setMsg] = useState('');
    const [messages , setMessages] = useState([]);
    const handleTyping = (isFocused) => {
      const currentUserTypingRef = database.ref(`conversation/${currentId}_${id_user}/isTyping`);
      currentUserTypingRef.set(isFocused);
  
      const otherUserTypingRef = database.ref(`conversation/${id_user}_${currentId}/isTyping`);
      otherUserTypingRef.on('value', (snapshot) => {
        const otherUserIsTyping = snapshot.val();
        setIsTyping(otherUserIsTyping);
      });
    };
    useEffect(() => {
      setMessages("")
      const messageRef = database.ref('msgS').orderByChild('time');
      
      messageRef.on('value', (snapshot) => {
        const messagesArray = [];
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          if (
            (message.sender === currentId && message.receiver === id_user) ||
            (message.sender === id_user && message.receiver === currentId)
          ) {
            messagesArray.push({ ...message, id: childSnapshot.key });
          }
        });
        // Sort messages by time or any other relevant criterion
        messagesArray.sort((a, b) => a.time - b.time);
        setMessages(messagesArray);
      });
    
      // Clean up the listener when the component unmounts
      return () => {
        messageRef.off('value');
      };
    }, [currentId, id_user]);
    const handleDropMessage = (messageId) => {
      // Prompt the user to confirm before dropping the message
      const confirmDrop = window.confirm('Are you sure you want to drop this message?');
      
      if (confirmDrop) {
        // Find the message with the specified ID in the database
        const messagesRef = database.ref('msgS');
        messagesRef.orderByChild('id').equalTo(messageId).once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const messageKey = childSnapshot.key;
            // Update the status of the message to mark it as unsent
            database.ref(`msgS/${messageKey}`).update({ 
              msg: 'unsent',      
              droped: true,      
            })
            .then(() => {
              console.log(`Message with ID ${messageId} marked as unsent`);
              const messageRef = database.ref('msgS').orderByChild('time');
    
              messageRef.on('value', (snapshot) => {
                const messagesArray = [];
                snapshot.forEach((childSnapshot) => {
                  const message = childSnapshot.val();
                  if (
                    (message.sender === currentId && message.receiver === id_user) ||
                    (message.sender === id_user && message.receiver === currentId)
                  ) {
                    messagesArray.push({ ...message, id: childSnapshot.key });
                  }
                });
                // Sort messages by time or any other relevant criterion
                messagesArray.sort((a, b) => a.time - b.time);
                setMessages(messagesArray);
              });
            })
            .catch((error) => {
              console.error('Error updating message status:', error);
            });
          });
        });
      } else {
        console.log('Message drop canceled by user');
        // You might want to handle what happens if the user cancels dropping the message here
      }
    };

    const sendMessage = () => {
      const currentTime = new Date().toISOString();
      const ref_msg = database.ref("msgS");
      const key = ref_msg.push().key;
      console.log(id_user)
      ref_msg.child(key).set({
        id:currentId+"_"+id_user+"_"+currentTime,
        msg: msg,
        sender: currentId,
        receiver: id_user,
        time: currentTime,
        status:false,
        droped:false,
      });
      console.log(key)
      setMsg('');
    };
    const renderMessage = ({item}) => {
        const isCurrentUser = item.sender === currentId;
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

<View>

<KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      
      >
        {isTyping &&             <View style={[styles.messageContainer, styles.otherUserMessage]}>
 <Text style={styles.typingIndicator}>{`is typing...`}</Text>         </View>
}
        </KeyboardAvoidingView>
        </View>
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
  
  