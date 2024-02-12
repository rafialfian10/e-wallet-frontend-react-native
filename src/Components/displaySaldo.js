import { StyleSheet, Image, Text, View } from "react-native";

import Parse from "./parse";
import { GetUser } from "./Common/Hooks/getUser";

function DisplaySaldo() {
  const { user } = GetUser();
  const balance = user?.balance?.balance ? user?.balance?.balance.toFixed(2).replace(/\./g, ',') : '0,00';
 
  return (
    <View style={styles.contentSaldo}>
      <Image
        source={require("../../assets/logo2.png")}
        alt="logo2"
        style={styles.imgLogo}
      />
      <View style={styles.subContentSaldo}>
        <Text style={styles.textSaldo}>Saldo</Text>
        <Text style={styles.saldo}>Rp. {Parse(balance)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentSaldo: {
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
  subContentSaldo: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
  },
  textSaldo: {
    width: "100%",
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  saldo: {
    width: "100%",
    textAlign: "right",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default DisplaySaldo;
