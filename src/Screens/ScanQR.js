import { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

function ScanQR() {
  const [facing, setFacing] = useState("back");
  const [permission, setPermission] = useCameraPermissions();

  // Use Reducer
  // const [permission, setPermission] = useState(null);
  // const [state, dispatch] = useReducer(reducer, initialState);
  // const { cameraType, whbalance, flash, zoomValue } = state;

  const handleBarCodeScanned = ({ type, data }) => {
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === "granted");
    })();
  }, []);

  if (permission === null) {
    console.log("camera error");
    return;
  }

  if (!permission) {
    return (
      <Text style={styles.textCameraPermission}>
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
        focusable={true}
        flash="on"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
          interval: 10,
        }}
      >
        <View style={styles.contentBtnFlipCamera}>
          <TouchableOpacity
            style={styles.btnFlipCamera}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.textBtnFlipCamera}>Flip Camera</Text>
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
    borderColor: "red",
    borderWidth: 10,
  },
  contentBtnFlipCamera: {
    position: "absolute",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  btnFlipCamera: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  textBtnFlipCamera: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  textCameraPermission: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default ScanQR;
