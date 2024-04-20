import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
} from "react-native";

import FormCreatePin from "../Components/formCreatePin";
import FormConfirmPin from "../Components/formConfirmPin";

const Pin = ({ navigation }) => {
  const [screen, setScreen] = useState(0);
  const formTitle = ["Create PIN", "Confirm PIN"];
  const [form, setForm] = useState({
    pin: "",
    confirmPin: "",
  });
  const [error, setError] = useState({
    pin: "",
    confirmPin: "",
  });

  const screenDisplay = () => {
    if (screen === 0) {
      return <FormCreatePin form={form} setForm={setForm} error={error} />;
    } else if (screen === 1) {
      return (
        <FormConfirmPin
          navigation={navigation}
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
        />
      );
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...error };
    if (screen === 0) {
      if (form.pin.trim() === "") {
        newErrors.pin = "PIN is required";
        isValid = false;
      } else if (form.pin.length !== 6) {
        newErrors.pin = "PIN must be 6 characters long";
        isValid = false;
      } else {
        newErrors.pin = "";
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
      <ScrollView style={styles.contentRegister}>
        <View style={styles.contentNavigationRegister}>
          <Pressable disabled={screen === 0} onPress={handlePrev}>
            <AntDesign name="left" size={26} color="#000000" />
          </Pressable>
          <Pressable disabled={screen === 1} onPress={handleNext}>
            <AntDesign name="right" size={26} color="#000000" />
          </Pressable>
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.formTitle}>{formTitle[screen]}</Text>
          {screenDisplay()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerRegister: {
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
  containerInput: {
    width: "75%",
    alignSelf: "center",
  },
  formTitle: {
    width: "100%",
    marginVertical: 25,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#808080",
  },
});

export default Pin;
