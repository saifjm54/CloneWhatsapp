
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import List_Profile from "../Homescreens/List_Profile";
import MyAccount from "../Homescreens/MyAccount";
import Groupe from "../Homescreens/Groupe";
const Tab = createMaterialBottomTabNavigator();

const Home = (props) => {
    
  const currentId = props.route.params.currentId;
    return (
      <Tab.Navigator>
        <Tab.Screen name="listprofile" component={List_Profile}  initialParams={{currentId}}/>
        <Tab.Screen name="groupe" component={Groupe} initialParams={{currentId}}/>
        <Tab.Screen name="myaccount" component={MyAccount} initialParams={{currentId}} />
      </Tab.Navigator>
    );
  };


export default Home;
