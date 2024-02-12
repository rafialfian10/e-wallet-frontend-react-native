import { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import DisplayLogo from "../Components/displayLogo";
import { UserContext } from "../Context/UserContext";
import { API, setAuthToken } from "../Config/Api";

const Login = ({ navigation }) => {
  const [state, dispatch] = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });

    if (data === "email") {
      setError((prevError) => ({
        ...prevError,
        email: value.trim() === "" ? "Email is required" : "",
      }));
    }

    if (data === "password") {
      setError((prevError) => ({
        ...prevError,
        password: value.trim() === "" ? "Password is required" : "",
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const messageError = {
        email: form.email === "" ? "Email is required" : "",
        password: form.password === "" ? "Password is required" : "",
      };

      if (!messageError.email && !messageError.password) {
        const body = JSON.stringify(form);

        try {
          const response = await API.post("/login", body, config);
          if (response.data.status === 200) {
            if (response.data.data.token) {
              await AsyncStorage.setItem("token", response.data.data.token);
              setAuthToken(response.data.data.token);
            }
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: response.data.data,
            });
            alert("Login successfully");
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            alert(error.response.data.message);
          } else {
            throw error;
          }
        }
      } else {
        setError(messageError);
      }
    } catch (error) {
      console.log("login failed", error);
    }
  };

  return (
    <SafeAreaView style={styles.containerLogin}>
      <LinearGradient
        colors={["#3cb371", "#98fb98", "#e0ffff"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.containerLinierGradient}
      >
        <ScrollView style={styles.contentLogin}>
          <DisplayLogo />
          <Text style={styles.title}>Login</Text>
          <View style={styles.containerInput}>
            <View style={styles.contentInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                onChangeText={(value) => handleChange("email", value)}
                value={form.email}
              />
              {error.email && (
                <Text style={styles.errorLogin}>{error.email}</Text>
              )}
            </View>
            <View style={styles.contentInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                secureTextEntry={!showPassword}
                onChangeText={(value) => handleChange("password", value)}
                value={form.password}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={handleTogglePassword}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#808080"
                />
              </TouchableOpacity>
              {error.password && (
                <Text style={styles.errorLogin}>{error.password}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText} onPress={handleSubmit}>
              Login
            </Text>
          </TouchableOpacity>
          <Text style={styles.textRegister}>
            New Users?
            <Text
              onPress={() => navigation.navigate("Register")}
              style={styles.linkRegister}
            >
              {" "}
              Register
            </Text>
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerLogin: {
    flex: 1,
  },
  containerLinierGradient: {
    flex: 1,
  },
  contentLogin: {
    marginTop: 80,
  },
  title: {
    width: "75%",
    marginTop: 190,
    marginBottom: 15,
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "#808080",
  },
  containerInput: {
    width: "75%",
    alignSelf: "center",
  },
  contentInput: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 25,
    overflow: "hidden",
  },
  textInput: {
    width: "100%",
    alignSelf: "center",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingLeft: 20,
    justifyContent: "center",
  },
  togglePasswordButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  errorLogin: {
    width: "100%",
    alignSelf: "center",
    fontSize: 11,
    color: "red",
    paddingHorizontal: 5,
  },
  btn: {
    width: "75%",
    height: 50,
    padding: 10,
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 20,
    backgroundColor: "#3cb371",
  },
  btnText: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },
  textRegister: {
    marginTop: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  linkRegister: {
    color: "#3cb371",
    fontWeight: "700",
  },
});

export default Login;
