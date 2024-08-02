import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons'
import SignInScreen from './screens/SignInScreen';
import CreateListingScreen from './screens/CreateListingScreen';
import Bookings from './screens/Bookings';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, TouchableOpacity } from "react-native";

import { signOut } from "firebase/auth";
import { auth } from "./config/FirebaseConfig";

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

const MainTabs = ({route, navigation}) => {
  const { userID, userEmail, userData } = route.params;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        Alert.alert("Logout Error", error.message);
      });
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2d9cdb', 
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // route list of route objects used for rendering the tabs
          // icon: icon for the route to display the tab bar

          if (route.name === 'Create Listing') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#2d9cdb',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Create Listing" component={CreateListingScreen} initialParams={{ userID, userEmail, userData }} />
      <Tab.Screen name="Bookings" component={Bookings}  initialParams={{ userID, userEmail, userData }} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={SignInScreen} />
        <Stack.Screen name="Owner App" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
