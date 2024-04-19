import { OtpInput } from "react-native-otp-entry";
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
} from "react-native";

function FormCreatePin({ form, setForm, error }) {
  return (
    <View style={styles.subContentInput} onTouchStart={Keyboard.dismiss}>
      <OtpInput
        numberOfDigits={6}
        onTextChange={(pin) => {
          setForm({ ...form, pin });
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
      {error.pin && <Text style={styles.errorPIN}>{error.pin}</Text>}
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
    paddingHorizontal: 8,
    alignSelf: "center",
    textAlign: "left",
    textAlignVertical: "center",
    fontSize: 11,
    color: "red",
  },
});

export default FormCreatePin;
