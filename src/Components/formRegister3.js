import validator from "validator";
import { OtpInput } from "react-native-otp-entry";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
} from "react-native";

import BtnResendOtp from "./btnResendOtp";
import BtnVerifyOtp from "./btnVerifyOtp";

function FormRegister3({ navigation, form, setForm, error, setError }) {
  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });

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

    if (data === "otp") {
      setError((prevError) => ({
        ...prevError,
        otp: value.trim() === "" ? "Otp is required" : "",
      }));
    }
  };

  return (
    <View style={styles.subContentInput} onTouchStart={Keyboard.dismiss}>
      <View style={styles.contentInput}>
        <TextInput
          style={styles.textInput}
          placeholder="Email..."
          onChangeText={(value) => handleChange("email", value)}
          value={form.email}
        />
        {error.email && (
          <Text style={styles.errorVerifyOtp}>{error.email}</Text>
        )}
      </View>
      <OtpInput
        numberOfDigits={6}
        onTextChange={(otp) => {
          setForm({ ...form, otp });
        }}
        focusColor="#000000"
        focusStickBlinkingDuration={500}
        autoFocus={false}
        theme={{
          // containerStyle: styles.container,
          // inputsContainerStyle: styles.inputsContainer,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
        }}
      />
      {error.otp && (
        <Text style={styles.errorVerifyOtp}>{error.otp}</Text>
      )}
      <View style={styles.contentBtnVerifyOtp}>
        <BtnVerifyOtp navigation={navigation} form={form} setForm={setForm} setError={setError} />
        <BtnResendOtp form={form} setError={setError} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subContentInput: {
    width: "100%",
  },
  contentInput: {
    width: "100%",
    marginBottom: 30,
    overflow: "hidden",
  },
  textInput: {
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 25,
    color: "#808080",
    backgroundColor: "#FFFFFF",
  },
  pinCodeContainer: {
    borderColor: "#808080",
    borderWidth: 1,
  },
  pinCodeText: {
    color: "#808080",
  },
  focusStick: {
    borderColor: "#808080",
    borderWidth: 1,
  },
  activePinCodeContainer: {
    borderColor: "#808080",
    borderWidth: 1,
  },
  errorVerifyOtp: {
    width: "100%",
    paddingHorizontal: 8,
    alignSelf: "center",
    textAlign: "justify",
    fontSize: 11,
    color: "red",
  },
  contentBtnVerifyOtp: {
    width: "100%",
    marginTop: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
});

export default FormRegister3;
