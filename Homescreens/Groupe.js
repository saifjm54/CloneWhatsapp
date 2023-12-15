import { View, Text } from 'react-native';
import React from 'react';
import firebase from '../Config/Index';
import { useIsFocused } from '@react-navigation/native';
import  { useState,useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Divider, List } from 'react-native-paper';
export default function Groupe({ navigation }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  ;
  
 // Access the currentid parameter from route.params
  const database = firebase.database();
  const channelsRef = database.ref('channels');
  const [filteredChannels, setFilteredChannels] = useState([]);
  useEffect(() => {
    channelsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const channels = Object.values(data);
        
        // Filter out the profile where uid matches the key
        
        setChannels(channels);
        setFilteredChannels(channels);
      }
    });
    console.log(filteredChannels)
    
  }, []);
  return (
    <View style={styles.container}>
    <FlatList
      data={filteredChannels}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          description={item.type}
          titleNumberOfLines={1}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
          descriptionNumberOfLines={1}
          onPress={() => navigation.navigate('Chat', { channel: item })}
        />
      )}
    />
  </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});