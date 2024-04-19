import { useEffect, useState, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserContext } from "../Context/UserContext";
import { setAuthToken, API } from "../Config/Api";

import Index from "./Index";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Pin from "./Pin";
import Profile from "./Profile";
import QrCode from "./QrCode";
import Transfer from "./Transfer";
import Topup from "./Topup";
import History from "./History";
import ScanQR from "./ScanQR";
import Message from "./Message";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerMode: "screen",
        headerTitle: "",
        headerStatusBarHeight: -10,
        headerTintColor: "#FFFFFF",
        headerStyle: {
          borderColor: "#FFFFFF",
          borderWidth: 1,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "History") {
            iconName = focused ? "receipt" : "receipt-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Message") {
            iconName = focused ? "message-text" : "message-text-outline";
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          }
        },
        tabBarActiveTintColor: "#003366",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Message" component={Message} />
    </Tab.Navigator>
  );
}

const ContainerNavigation = () => {
  const [state, dispatch] = useContext(UserContext);

  const [login, setLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setLogin(true);
        setAuthToken(token);

        // get profile
        const response = await API.get(`/checkauth`);

        let payload = response.data.data;
        payload.token = token;
        // console.log(payload)

        dispatch({
          type: "USER_SUCCESS",
          payload: payload,
        });
        setIsLoading(false);
      } else {
        setLogin(false);
      }
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: {},
      });
      setIsLoading(false);
      console.log(err);
    }
  };

  async function isAsyncTokenExist() {
    await AsyncStorage.getItem("token");
    checkLogin();
  }

  useEffect(() => {
    checkLogin();
    isAsyncTokenExist();
  }, [state.isLogin]);

  return (
    <>
      <Stack.Navigator>
        {state.isLogin ? (
          state.user.pin !== null ? (
            <>
              <Stack.Screen
                name="MyTab"
                component={MyTab}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                  headerMode: "screen",
                  headerTitle: "",
                  headerStatusBarHeight: -10,
                  headerTintColor: "#FFFFFF",
                }}
              />
              <Stack.Screen
                name="QrCode"
                component={QrCode}
                options={{
                  headerMode: "screen",
                  headerTitle: "",
                  headerStatusBarHeight: -10,
                  headerTintColor: "#FFFFFF",
                }}
              />
              <Stack.Screen
                name="ScanQR"
                component={ScanQR}
                options={{
                  headerMode: "screen",
                  headerTitle: "",
                  headerStatusBarHeight: -10,
                  headerTintColor: "#FFFFFF",
                }}
              />
              <Stack.Screen
                name="Transfer"
                component={Transfer}
                options={{
                  headerMode: "screen",
                  headerTitle: "",
                  headerStatusBarHeight: -10,
                  headerTintColor: "#FFFFFF",
                }}
              />
              <Stack.Screen
                name="Topup"
                component={Topup}
                options={{
                  headerMode: "screen",
                  headerTitle: "",
                  headerStatusBarHeight: -10,
                  headerTintColor: "#FFFFFF",
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Pin"
                component={Pin}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerMode: "screen",
                  headerTitle: "",
                  headerStatusBarHeight: -10,
                  headerTintColor: "#FFFFFF",
                }}
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen
              name="Index"
              component={Index}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default ContainerNavigation;
