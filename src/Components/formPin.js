import { useState, useEffect } from "react";
import { OtpInput } from "react-native-otp-entry";
import { StyleSheet, View, Text, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GetTransactionsUser } from "./Common/Hooks/getTransactionsUser";
import { API } from "../Config/Api";

const bcrypt = require("bcryptjs");

function FormPin(props) {
  const {
    user,
    refetchUser,
    form,
    setForm,
    error,
    setError,
    setModalTransactionSuccess,
    setDataTransactionSuccess,
  } = props;

  const { refetchTransactionsUser } = GetTransactionsUser(1);

  const [pinCompleted, setPinCompleted] = useState(false);

  useEffect(() => {
    setPinCompleted(form?.pin.length === 6);
  }, [form?.pin]);

  useEffect(() => {
    if (pinCompleted) {
      handleTransfer();
    }
  }, [pinCompleted]);

  const handleTransfer = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Bearer Token": "Bearer " + AsyncStorage.getItem("Token"),
        },
      };

      let pinMatches = bcrypt.compareSync(form?.pin, user?.pin);

      const messageError = {
        pin: pinMatches ? "" : "PIN does not match, please try again",
      };

      if (pinMatches) {
        const body = JSON.stringify({
          ...form,
          amount: parseFloat(form?.amount),
          pin: user?.pin,
          otherUserId: form?.otherUserId,
        });

        let response;
        if (form.transactionType === "transfer") {
          if (user.balance.balance < form.amount) {
            setError({
              balance: `Balance is not sufficient, your remaining balance is`,
            });
            return;
          }
          response = await API.post("/transfer", body, config);
        } else {
          response = await API.post("/topup", body, config);
        }

        if (response.data.status === 200) {
          refetchUser();
          refetchTransactionsUser();
          setForm({
            amount: "",
            pin: "",
            otherUserId: "",
            transactionType: "",
          });
          setError({
            amount: "",
            balance: "",
            pin: "",
            otherUserId: "",
          });
          setDataTransactionSuccess({ visible: true, data: form });
          setModalTransactionSuccess(true);
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
      {error.balance && (
        <Text style={styles.errorPIN}>
          {error.balance}{" "}
          <Text style={styles.textErrorBalance}>{user?.balance.balance}</Text>
        </Text>
      )}
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
    marginTop: 10,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 14,
    color: "red",
  },
  textErrorBalance: {
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default FormPin;
