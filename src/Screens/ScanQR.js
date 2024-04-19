import { useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

function ScanQR() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarCodeScanned = ({ type, data }) => {
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
  };

  if (!permission) {
    console.log("camera error");
    return;
  }

  if (!permission?.granted) {
    return (
      <Text style={{ textAlign: "center" }}>
        We need your permission to show the camera
      </Text>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <SafeAreaView style={styles.containerCamera}>
      <CameraView
        style={styles.cameraView}
        facing={facing}
        // ratio="16:9"
        barcodeScannerSettings={{
          barCodeTypes: ["qr"],
          interval: 10,
        }}
        // barCodeSize={{ width: 500, height: 500 }}
        // onBarcodeScanned={handleBarCodeScanned}
        flash="on"
      >
        <View style={styles.contentBtnCamera}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerCamera: {
    flex: 1,
    justifyContent: "center",
  },
  cameraView: {
    flex: 1,
  },
  contentBtnCamera: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default ScanQR;
