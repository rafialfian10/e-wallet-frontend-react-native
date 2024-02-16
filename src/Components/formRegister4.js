import { OtpInput } from "react-native-otp-entry";
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
} from "react-native";

import { API } from "../Config/Api";

function FormRegister4({ navigation, form, setForm, error, setError }) {
  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const messageError = {
        confirmPin: form.pin !== form.confirmPin ? "PIN not valid" : "",
        
      };

      if (!messageError.confirmPin) {
        const body = JSON.stringify(form);

        try {
          const response = await API.post("/register", body, config);
          if (response?.data?.status === 201) {
            alert("Register successfully");
            setForm({
              username: "",
              email: "",
              password: "",
              phone: "",
              pin: "",
              confirmPin: "",
            });
            setError({
              username: "",
              email: "",
              password: "",
              phone: "",
              pin: "",
              confirmPin: "",
            });
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
    <View style={styles.subContentInput} onTouchStart={Keyboard.dismiss}>
      <OtpInput
        numberOfDigits={6}
        onTextChange={(confirmPin) => {
          setForm({ ...form, confirmPin });
        }}
        focusColor="#000000"
        focusStickBlinkingDuration={500}
        autoFocus
        theme={{
          // containerStyle: styles.container,
          // inputsContainerStyle: styles.inputsContainer,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
        }}
      />
      {error.confirmPin && <Text style={styles.errorPIN}>{error.confirmPin}</Text>}
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
    </View>
  );
}

const styles = StyleSheet.create({
  subContentInput: {
    width: "100%",
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
  errorPIN: {
    width: "100%",
    marginTop: 10,
    alignSelf: "center",
    textAlign: "left",
    textAlignVertical: "center",
    fontSize: 11,
    color: "red",
  },
  btn: {
    width: "100%",
    height: 50,
    marginTop: 110,
    padding: 10,
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
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

export default FormRegister4;
