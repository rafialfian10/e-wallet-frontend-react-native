import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import validator from "validator";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";

import DisplayLogo from "../Components/displayLogo";
import { API } from "../Config/Api";

const Register = ({ navigation }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    username: "",
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

    if (data === "username") {
      setError((prevError) => ({
        ...prevError,
        userName: value.trim() === "" ? "Username is required" : "",
      }));
    }

    if (data === "email") {
      if (value.trim() === "") {
        setError((prevError) => ({
          ...prevError,
          email: "Email is required",
        }));
      } else if (!validator.isEmail(value)) {
        setError((prevError) => ({
          ...prevError,
          email: "Please enter a valid email address",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          email: "",
        }));
      }
    }

    if (data === "password") {
      setError((prevError) => ({
        ...prevError,
        password: value.trim() === "" ? "Password is required" : "",
      }));

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

      if (value.trim() !== "" && !passwordRegex.test(value)) {
        setError((prevError) => ({
          ...prevError,
          password:
            "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character",
        }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const messageError = {
        username: form.username === "" ? "Username is required" : "",
        email: form.email === "" ? "Email is required" : "",
        password: form.password === "" ? "Password is required" : "",
      };

      if (
        !messageError.username &&
        !messageError.email &&
        !messageError.password
      ) {
        const body = JSON.stringify(form);

        try {
          const response = await API.post("/register", body, config);
          if (response?.data?.status === 200) {
            alert("Register successfully");
            navigation.navigate("Login");
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
      console.log("register failed", error);
    }
  };

  return (
    <SafeAreaView style={styles.containerRegister}>
      <LinearGradient
        colors={["#3cb371", "#98fb98", "#e0ffff"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.containerLinierGradient}
      >
        <ScrollView style={styles.contentRegister}>
          <DisplayLogo />
          <Text style={styles.title}>Register</Text>
          <View style={styles.containerInput}>
            <View style={styles.contentInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Username"
                onChangeText={(value) => handleChange("username", value)}
                value={form.username}
              />
              {error.username && (
                <Text style={styles.errorRegister}>{error.username}</Text>
              )}
            </View>
            <View style={styles.contentInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                onChangeText={(value) => handleChange("email", value)}
                value={form.email}
              />
              {error.email && (
                <Text style={styles.errorRegister}>{error.email}</Text>
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
                <Text style={styles.errorRegister}>{error.password}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
            <Text style={styles.btnText}>Register</Text>
          </TouchableOpacity>
          <Text style={styles.textLogin}>
            Joined us before?
            <Text
              onPress={() => navigation.navigate("Login")}
              style={styles.linkLogin}
            >
              {" "}
              Login
            </Text>
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerRegister: {
    flex: 1,
  },
  containerLinierGradient: {
    flex: 1,
  },
  contentRegister: {
    marginTop: 80,
  },
  title: {
    width: "75%",
    marginTop: 150,
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
  errorRegister: {
    width: "100%",
    paddingHorizontal: 5,
    alignSelf: "center",
    textAlign: "justify",
    fontSize: 11,
    color: "red",
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
    backgroundColor: "#3CB371",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center",
  },
  textLogin: {
    marginTop: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  linkLogin: {
    color: "#3CB371",
    fontWeight: "800",
  },
});

export default Register;
