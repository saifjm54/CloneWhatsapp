import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import firebase from '../Config/Index';
import { useRoute } from '@react-navigation/native';

const database = firebase.database();

export default function Chat() {
    const route = useRoute();
    const {currentId, id_user} = route.params;
    const [msg, setMsg] = useState('');
    const [messages , setMessages] = useState([]);
    useEffect(() => {
        const messageRef = database.ref('msgS').orderByChild('time');

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
        const currentTime = new Date().toISOString();
        const ref_msg = database.ref("msgS");
        const key = ref_msg.push().key;
        ref_msg.child(key).set({
            msg: msg,
            send: currentId,
            receiver: id_user,
            time: currentTime,
            status:false
        });
        setMsg('');
    };
    const renderMessage = ({item}) => {
        const isCurrentUser = item.sender === currentId;
        return(
            <View style={[styles.messageContainer,isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
                <Text>{item.msg}</Text>
            </View>
        )
    }
}