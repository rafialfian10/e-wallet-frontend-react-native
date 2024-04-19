import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
} from "react-native";

import DisplayLogo from "../Components/displayLogo";
import FormRegister1 from "../Components/formRegister1";
import FormRegister2 from "../Components/formRegister2";
import FormRegister3 from "../Components/formRegister3";

const Register = ({ navigation, route }) => {
  const [screen, setScreen] = useState(0);
  const formTitle = [
    "Enter Personal Data",
    "Enter Phone Number",
    "One Time Password (OTP) has been sent to your email",
  ];
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  });

  const screenDisplay = () => {
    if (screen === 0) {
      return (
        <FormRegister1
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
        />
      );
    } else if (screen === 1) {
      return (
        <FormRegister2
          navigation={navigation}
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
          setScreen={setScreen}
        />
      );
    } else if (screen === 2) {
      return (
        <FormRegister3
          navigation={navigation}
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
        />
      );
    }
  };

  useEffect(() => {
    if (route.params?.screen) {
      setScreen(route.params.screen === "FormRegister3" ? 2 : 0);
    }
  }, [route.params?.screen]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...error };
    if (screen === 0) {
      if (form.username.trim() === "") {
        newErrors.username = "Username is required";
        isValid = false;
      } else {
        newErrors.username = "";
      }

      if (form.email.trim() === "") {
        newErrors.email = "Email is required";
        isValid = false;
      } else {
        newErrors.email = "";
      }

      if (form.password.trim() === "") {
        newErrors.password = "Password is required";
        isValid = false;
      } else {
        newErrors.password = "";
      }
    } else if (screen === 1) {
      if (form.phone.trim() === "") {
        newErrors.phone = "Phone is required";
        isValid = false;
      } else {
        newErrors.phone = "";
      }
    }

    setError(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      setScreen((currScreen) => currScreen + 1);
    }
  };

  const handlePrev = () => {
    setScreen((currScreen) => currScreen - 1);
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
          <View style={styles.contentNavigationRegister}>
            <Pressable disabled={screen === 0} onPress={handlePrev}>
              <AntDesign name="left" size={26} color="#000000" />
            </Pressable>
            <Pressable disabled={screen === 2} onPress={handleNext}>
              <AntDesign name="right" size={26} color="#000000" />
            </Pressable>
          </View>
          <DisplayLogo />
          <Text style={styles.title}>Register</Text>
          <View style={styles.containerInput}>
            <Text style={styles.formTitle}>{formTitle[screen]}</Text>
            {screenDisplay()}
          </View>
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
  contentNavigationRegister: {
    width: "100%",
    top: 0,
    padding: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  title: {
    width: "75%",
    marginTop: 50,
    marginBottom: 10,
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "#808080",
  },
  formTitle: {
    width: "75%",
    marginVertical: 25,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#808080",
  },
  containerInput: {
    width: "75%",
    alignSelf: "center",
  },
});

export default Register;
