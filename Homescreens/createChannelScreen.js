import { Button, Card, IconButton, Text, TextInput, Title } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import firebase from '../Config/Index';
const database=firebase.database();
export default function CreateChannelScreen({ navigation }) {
    const [channels,setChannel] = useState({
    name: '',
    type: 'public',});
    const handleName = (text) => {
      setChannel({ ...channels, name: text})
    }
    const handleButtonPress = async () => {
        if(channels.name.length > 0 )
        {
            await database.ref('channels').push(channels);
            console.log('Channel Created  successfully!');
            navigation.navigate('Groupe');
        }
        
      };

    return(
        <View style={styles.rootContainer}>
      <View style={styles.closeButtonContainer}>
           <IconButton 
              icon='close-circle'
              size={36}
              iconColor='#5b3a70'
          onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.innerContainer}>
      <Title style={styles.title}>Create a new channel</Title>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Channel Name</Text>
          <TextInput
            value={channels.name}
            onChangeText={handleName}
            style={styles.input}
          />
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        style={styles.saveButton}
        labelStyle={styles.buttonLabel}
        onPress={async() => {await handleButtonPress()}}
        disabled={channels.name.length === 0}
      >
        Save
      </Button>
      </View>
      </View>
    )
}
const styles = StyleSheet.create({
    rootContainer: {
      flex: 1
    },
    closeButtonContainer: {
      position: 'absolute',
      top: 30,
      right: 0,
      zIndex: 1
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      fontSize: 24,
      marginBottom: 10
    },
    buttonLabel: {
      fontSize: 22,

    },container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      },
      saveButton: {
        width: '30%',
        margin: 20,
        height: 50,
        justifyContent: 'center',
      }
  });