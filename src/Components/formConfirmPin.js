import { useContext } from "react";
import { OtpInput } from "react-native-otp-entry";
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
} from "react-native";

import { API } from "../Config/Api";
import { UserContext } from "../Context/UserContext";

function FormConfirmPin({ navigation, form, setForm, error, setError }) {
  const [state, dispatch] = useContext(UserContext);

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
          const response = await API.patch(
            `/user/${state?.user?.id}`,
            body,
            config
          );
          if (response?.data?.status === 200) {
            alert("Pin successfully created");
            setForm({
              pin: "",
              confirmPin: "",
            });
            setError({
              pin: "",
              confirmPin: "",
            });
            navigation.navigate("Home");
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
      console.log("update user failed", error);
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
        // secureTextEntry={true}
        theme={{
          // containerStyle: styles.container,
          // inputsContainerStyle: styles.inputsContainer,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
        }}
      />
      {error.confirmPin && (
        <Text style={styles.errorPIN}>{error.confirmPin}</Text>
      )}
      <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
        <Text style={styles.btnText}>Confirm PIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  subContentInput: {
    width: "100%",
  },
  pinCodeContainer: {
    width: 40,
    height: 50,
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
    marginTop: 5,
    paddingHorizontal: 5,
    alignSelf: "center",
    textAlign: "left",
    textAlignVertical: "center",
    fontSize: 11,
    color: "red",
  },
  btn: {
    width: "100%",
    height: 50,
    marginTop: 350,
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
});

export default FormConfirmPin;
