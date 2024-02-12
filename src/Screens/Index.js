import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import DisplayLogo from "../Components/displayLogo";

const Index = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#3cb371", "#98fb98", "#e0ffff"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.containerLinierGradient}
      >
        <DisplayLogo />
        <View style={styles.contentBtn}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.btnText}>Register</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLinierGradient: {
    flex: 1,
  },
  contentBtn: {
    marginTop: 150,
  },
  btn: {
    width: "75%",
    height: 50,
    padding: 10,
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 20,
    backgroundColor: "#3cb371",
  },
  btnText: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },
});

export default Index;
