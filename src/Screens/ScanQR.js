import { useState, useEffect, useRef, useReducer } from "react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera/next";
import { FlashMode } from "expo-camera";
import Slider from "@react-native-community/slider";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from "react-native";

import FormPin from "../Components/formPin";
import ModalTransferSuccess from "../Components/modalTransactionSuccess";
import { GetUser } from "../Components/Common/Hooks/getUser";

// const cameraEffects = [
//   { id: "auto", property: "Auto" },
//   { id: "sunny", property: "Sunny" },
//   { id: "cloudy", property: "Cloudy" },
//   { id: "shadow", property: "Shadow" },
//   { id: "incandescent", property: "Incandescent" },
//   { id: "fluorescent", property: "Fluorescent" },
// ];

const initialState = {
  zoomValue: 0,
  whiteBalance: "auto",
  cameraType: "back",
  flash: "off",
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "@type/WH_BALANCE":
      return { ...state, whiteBalance: action.payload };
    case "@type/CAMERA_BACK":
    case "@type/CAMERA_FRONT":
      return { ...state, cameraType: action.payload };
    case "@type/FLASH":
      return { ...state, flash: action.payload };
    case "@type/ZOOM":
      return {
        ...state,
        zoomValue: action.payload,
      };
    default:
      return state;
  }
}

export default function ScanQR({ navigation }) {
  const { user, refetchUser } = GetUser();

  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTransferSuccess, setModalTransferSuccess] = useState(false);
  const [dataTransferSuccess, setDataTransferSuccess] = useState({
    visible: false,
    data: {},
  });
  const [form, setForm] = useState(null);
  const [error, setError] = useState({ pin: "", balance: "" });

  useEffect(() => {
    const getCameraPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setPermission(cameraPermission);
    };

    getCameraPermissions();
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { zoomValue, whiteBalance, cameraType, flash } = state;
  const camera = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Text style={styles.textCameraPermission}>
        We need your permission to show the camera
      </Text>
    );
  }

  const handleScanQR = (data) => {
    setScanned(true);
    if (data.data !== null) {
      try {
        const qrCodeData = JSON.parse(data.data);

        // Checks whether all the desired keys are present in the object
        const expectedKeys = [
          "amount",
          "transactionType",
          "pin",
          "otherUserId",
        ];
        const hasAllKeys = expectedKeys.every((key) =>
          qrCodeData.hasOwnProperty(key)
        );

        if (hasAllKeys) {
          setForm(qrCodeData);
        } else {
          throw new Error("Failed to scan, invalid QR code format");
        }
      } catch (error) {
        Alert.alert("", "Failed to scan, invalid QR code format", [
          {
            text: "Tap to Scan Again",
            onPress: () => setScanned(false),
          },
        ]);
      }
    }
  };

  const handleToggleFlipCamera = () => {
    if (cameraType === "back") {
      dispatch({ type: "@type/CAMERA_FRONT", payload: "front" });
    } else {
      dispatch({ type: "@type/CAMERA_BACK", payload: "back" });
    }
  };

  const handleToggleFlash = () => {
    if (flash === "off") {
      dispatch({ type: "@type/FLASH", payload: "on" });
    } else {
      dispatch({ type: "@type/FLASH", payload: "off" });
    }
  };

  const zoomEffect = (value) => {
    dispatch({ type: "@type/ZOOM", payload: value });
  };

  // const handleWhiteBalance = (value) => {
  //   if (value.length > 0) {
  //     dispatch({ type: "@type/WH_BALANCE", payload: value });
  //   }
  // };

  return form !== null ? (
    <SafeAreaView style={styles.containerScanQr}>
      <FormPin
        user={user}
        refetchUser={refetchUser}
        form={form}
        setForm={setForm}
        error={error}
        setError={setError}
        setModalTransactionSuccess={setModalTransferSuccess}
        setDataTransactionSuccess={setDataTransferSuccess}
      />
      <ModalTransferSuccess
        navigation={navigation}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalTransactionSuccess={modalTransferSuccess}
        setModalTransactionSuccess={setModalTransferSuccess}
        dataTransactionSuccess={dataTransferSuccess}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.containerScanQr}>
      <StatusBar />
      <View style={styles.contentCamera}>
        <Image
          source={require("../../assets/scan-code.png")}
          style={styles.scanQr}
          alt="scan-qr"
        />
        <CameraView
          style={styles.cameraView}
          ref={camera}
          autoFocus={true}
          zoom={zoomValue}
          facing={cameraType}
          flash={FlashMode.on}
          onBarcodeScanned={scanned ? undefined : handleScanQR}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
            interval: 10,
          }}
          // ratio="16:9"
          // whiteBalance={whiteBalance}
        />
        <Text style={styles.textQrCode}>put the QR code in the frame</Text>
      </View>
      <View style={styles.contentZoomSlider}>
        <Slider
          onValueChange={zoomEffect}
          style={styles.zoomSlider}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#808080"
        />
      </View>
      <View style={styles.contentCameraOption}>
        <View style={styles.cameraOption}>
          {/* <View style={styles.contentCameraEffects}>
                <ScrollView horizontal={true}>
                  {cameraEffects?.map((cameraEffect) => (
                    <TouchableWithoutFeedback
                      onPress={() => handleWhiteBalance(cameraEffect?.id)}
                      key={cameraEffect?.id}
                    >
                      <View style={styles.itemCameraEffect}>
                        <Text style={styles.textItemCameraEffect}>
                          {cameraEffect?.property}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </ScrollView>
              </View> */}
          <View style={styles.contentCameraIcon}>
            <TouchableOpacity onPress={handleToggleFlipCamera}>
              <MaterialCommunityIcons
                name="camera-flip"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToggleFlash}>
              <MaterialCommunityIcons
                name={flash === "on" ? "flashlight" : "flashlight-off"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <FontAwesome name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerScanQr: {
    flex: 1,
  },
  contentCamera: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scanQr: {
    width: 400,
    height: 400,
    position: "absolute",
    top: 50,
    alignSelf: "center",
  },
  cameraView: {
    width: 260,
    height: 260,
    position: "absolute",
    top: 120,
    alignSelf: "center",
  },
  textQrCode: {
    width: "100%",
    marginTop: 450,
    textAlign: "center",
    fontSize: 14,
    color: "#FFFFFF",
  },
  contentZoomSlider: {
    width: "100%",
    position: "absolute",
    top: 500,
  },
  zoomSlider: {
    width: "100%",
    height: 50,
  },
  contentCameraOption: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 50,
    backgroundColor: "#000000",
    opacity: 0.5,
  },
  cameraOption: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  contentCameraEffects: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#808080",
  },
  itemCameraEffect: {
    padding: 10,
  },
  textItemCameraEffect: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  contentCameraIcon: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textCameraPermission: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
