import { useState, useEffect, useContext } from "react";
import { OtpInput } from "react-native-otp-entry";
import { StyleSheet, View, Text, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserContext } from "../Context/UserContext";
import { API } from "../Config/Api";

function FormPin(props) {
  const {
    refetchUser,
    form,
    setForm,
    error,
    setError,
    setModalTransactionSuccess,
    setDataTransactionSuccess,
  } = props;

  const [state, dispatch] = useContext(UserContext);
  const pin = state?.user?.pin;

  const [pinCompleted, setPinCompleted] = useState(false);

  useEffect(() => {
    setPinCompleted(form.pin.length === 6);
  }, [form.pin]);

  useEffect(() => {
    if (pinCompleted) {
      handleTransfer();
    }
  }, [pinCompleted]);

  console.log(form);

  const handleTransfer = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Bearer Token": "Bearer " + AsyncStorage.getItem("Token"),
        },
      };

      const messageError = {
        pin: form.pin != pin ? "PIN does not match, please try again" : "",
      };

      if (!messageError.pin) {
        const body = JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          pin: parseInt(form.pin),
          otherUserId: form.otherUserId,
        });

        if(form.transactionType === "transfer") {
          const response = await API.post("/transfer", body, config);
          if (response.data.status === 200) {
            refetchUser();
            setForm({ amount: "", pin: "", otherUserId: "" });
            setError({ amount: "", pin: "", otherUserId: "" });
            setDataTransactionSuccess({ visible: true, data: form });
            setModalTransactionSuccess(true);
          }
        } else {
          const response = await API.post("/topup", body, config);
          if (response.data.status === 200) {
            refetchUser();
            setForm({ amount: "", pin: "", otherUserId: "" });
            setError({ amount: "", pin: "", otherUserId: "" });
            setDataTransactionSuccess({ visible: true, data: form });
            setModalTransactionSuccess(true);
          }
        }
      } else {
        setError(messageError);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.containerPin} onTouchStart={Keyboard.dismiss}>
      <Text style={styles.enterPIN}>Enter PIN</Text>
      <Text style={styles.descriptionPIN}>Use Your Nutech E-Wallet PIN</Text>
      <OtpInput
        numberOfDigits={6}
        onTextChange={(pin) => {
          setForm({ ...form, pin });
        }}
        focusColor="#A9A9A9"
        focusStickBlinkingDuration={500}
        autoFocus
      />
      {error.pin && <Text style={styles.errorPIN}>{error.pin}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  containerPin: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 35,
    paddingBottom: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  enterPIN: {
    marginBottom: 5,
    color: "#000000",
    fontSize: 24,
    fontWeight: "bold",
  },
  descriptionPIN: {
    marginBottom: 30,
    fontSize: 16,
    color: "#A9A9A9",
  },
  errorPIN: {
    width: "100%",
    marginTop: 20,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 14,
    color: "red",
  },
});

export default FormPin;
