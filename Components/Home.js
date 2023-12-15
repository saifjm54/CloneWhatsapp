
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import List_Profile from "../Homescreens/List_Profile";
import MyAccount from "../Homescreens/MyAccount";
import Groupe from "../Homescreens/Groupe";
import { useRoute } from '@react-navigation/native';
import GroupeStack from "../Homescreens/GroupeStack";
const Tab = createMaterialBottomTabNavigator();

const Home = (props) => {
  const route = useRoute();
  const { currentid } = route.params;
    
    return (
      <Tab.Navigator initialRouteName="listprofile" screenOptions={{tabBarVisible: true}} backBehavior="initialRoute">
        <Tab.Screen name="listprofile" component={List_Profile}  initialParams={{currentid : currentid}}  options={{
          tabBarLabel: 'Profiles',
        }}/>
        <Tab.Screen name="groupe" component={GroupeStack} options={{
          tabBarLabel: 'Canals',
        }}/>
        <Tab.Screen name="myaccount" component={MyAccount} initialParams={{currentid: currentid}} options={{
          tabBarLabel: 'Account',
        }} />
      </Tab.Navigator>
    );
  };


export default Home;
