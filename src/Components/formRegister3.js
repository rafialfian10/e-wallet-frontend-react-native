import { useState, useEffect } from "react";
import validator from "validator";
import { OtpInput } from "react-native-otp-entry";
import moment from "moment";
import { StyleSheet, View, Text, TextInput, Keyboard } from "react-native";

import BtnResendOtp from "./btnResendOtp";
import BtnVerifyOtp from "./btnVerifyOtp";

function FormRegister3({ navigation, form, setForm, error, setError }) {
  const [expiryTime, setExpiryTime] = useState(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setExpiryTime((prevTime) => (prevTime ? prevTime - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
      <View style={styles.contentDate}>
        {error.otp && <Text style={styles.errorVerifyOtp}>{error.otp}error</Text>}
        <Text style={styles.textDate}>{expiryTime !== null ? moment.utc(expiryTime * 1000).format("mm:ss") : ""}</Text>
      </View>
      <View style={styles.contentBtnVerifyOtp}>
        <BtnVerifyOtp
          navigation={navigation}
          form={form}
          setForm={setForm}
          setError={setError}
        />
        <BtnResendOtp form={form} setError={setError} setExpiryTime={setExpiryTime} />
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
    width: 40,
    height: 50,
    marginBottom: 5,
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
    width: "auto",
    paddingHorizontal: 8,
    alignSelf: "center",
    textAlign: "justify",
    fontSize: 11,
    color: "red",
  },
  contentDate: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textDate: {
    paddingHorizontal: 5,
    fontSize: 11,
    color: "red",
  },
  contentBtnVerifyOtp: {
    width: "100%",
    marginTop: 30,
    borderRadius: 25,
    overflow: "hidden",
  },
});

export default FormRegister3;
