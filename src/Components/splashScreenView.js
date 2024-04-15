import { StyleSheet, SafeAreaView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const SplashScreenView = ({ spinner }) => {
  return (
    <SafeAreaView style={styles.containerSpinner}>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerText}
        color="#808080"
        animation="fade"
        overlayColor="#FFFFFF"
        size={50}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerSpinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  spinnerText: {
    marginTop: -40,
    fontSize: 17,
    color: "#808080",
  },
});

export default SplashScreenView;
