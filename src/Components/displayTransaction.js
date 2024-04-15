import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";

function DisplayTransaction({ navigation }) {

  return (
    <View style={styles.contentTransaction}>
      <TouchableOpacity
        style={styles.subContentTransaction}
        onPress={() => navigation.navigate("ScanQR")}
      >
        <Image
          source={require("../../assets/pay.png")}
          alt="pay"
          style={styles.imgTransaction}
        />
        <Text style={styles.textTransaction}>Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.subContentTransaction}
        onPress={() => navigation.navigate("Transfer")}
      >
        <Image
          source={require("../../assets/transfer.png")}
          alt="transfer"
          style={styles.imgTransaction}
        />
        <Text style={styles.textTransaction}>Transfer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.subContentTransaction}
        onPress={() => navigation.navigate("Topup")}
      >
        <Image
          source={require("../../assets/top-up.png")}
          alt="topup"
          style={styles.imgTransaction}
        />
        <Text style={styles.textTransaction}>Topup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contentTransaction: {
    width: "90%",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
  subContentTransaction: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imgTransaction: {
    width: 25,
    height: 25,
  },
  textTransaction: {
    fontSize: 12,
  },
});

export default DisplayTransaction;
