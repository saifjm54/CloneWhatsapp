import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Groupe from './Groupe';

import { IconButton } from 'react-native-paper';
import CreateChannelScreen from './createChannelScreen';
import ChatScreen from './ChatScreen';


const ChatStack = createStackNavigator();
const ModalStack = createStackNavigator();
export default function GroupeStack() {
    return (
        <ModalStack.Navigator screenOptions={{
          headerShown: false,
          presentation: 'modal'
        }}>
          <ModalStack.Screen name='ChatApp' component={ChatComponent} />
          <ModalStack.Screen name='CreateChannel' component={CreateChannelScreen} />
        </ModalStack.Navigator>
      );
    }
    
    function ChatComponent() {
      return (
        <ChatStack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#5b3a70'
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontSize: 22
            }
          }}
        >
          <ChatStack.Screen name='Groupe' component={Groupe}
          options={({ navigation }) => ({
            headerRight: () => (
              <IconButton
                icon='plus'
                size={28}
                iconColor='#ffffff'
                onPress={() => navigation.navigate('CreateChannel')}
              />
            )
          })}
          />
          <ChatStack.Screen
        name='Chat'
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params.channel.name
        })}
      />
        </ChatStack.Navigator>
      );
}