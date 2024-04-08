import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Text, View, TouchableOpacity } from "react-native";

import Parse from "./parse";

function DisplaySaldo({user}) {
  const balance = user?.balance?.balance
    ? user?.balance?.balance.toFixed(2).replace(/\./g, ",")
    : "0,00";

  const [showBalance, setShowBalance] = useState(false);

  const handleToggleBalance = () => {
    setShowBalance(!showBalance);
  };
  return (
    <View style={styles.contentBalance}>
      <Image
        source={require("../../assets/logo2.png")}
        alt="logo2"
        style={styles.imgLogo}
      />
      <View style={styles.subContentBalance}>
        <View style={styles.contentToggleBalance}>
          <TouchableOpacity
            style={styles.toggleBalanceButton}
            onPress={handleToggleBalance}
          >
            <Ionicons
              name={showBalance ? "eye" : "eye-off"}
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <Text style={styles.textBalance}>Balance</Text>
        </View>
        {showBalance && <Text style={styles.balance}>Rp. {Parse(balance)}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentBalance: {
    width: "90%",
    marginBottom: 20,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    alignSelf: "center",
    backgroundColor: "#3CB371",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.75,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  imgLogo: {
    width: "40%",
    height: 50,
  },
  subContentBalance: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
  },
  contentToggleBalance: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  toggleBalanceButton: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  textBalance: {
    marginLeft: 5,
    textAlign: "right",
    textAlignVertical: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  balance: {
    width: "100%",
    textAlign: "right",
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default DisplaySaldo;
