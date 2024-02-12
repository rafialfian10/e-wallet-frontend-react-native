import { StyleSheet, View, Text, Image } from "react-native";

function DisplayLogo() {
  return (
    <View style={styles.containerLogo}>
      <Image
        source={require("../../assets/wallet.png")}
        style={styles.imgLogo}
        alt="img-logo"
      />
      <View style={styles.contentLogo}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.imgNutech}
          alt="img-nutech"
        />
        <Text style={styles.textLogo}>Wallet</Text>
      </View>
    </View>
  );
}

export default DisplayLogo;

const styles = StyleSheet.create({
    containerLogo: {
      marginTop: 100,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    imgLogo: {
      width: "50%",
      width: 100,
      height: 100,
    },
    contentLogo: {
      width: "50%",
      height: "100%",
      position: "relative",
    },
    imgNutech: {
      width: "100%",
      position: "absolute",
      bottom: 0,
    },
    textLogo: {
      position: "absolute",
      left: 0,
      bottom: 0,
      fontSize: 20,
      fontWeight: "bold",
      color: "#808080",
    },
  });
