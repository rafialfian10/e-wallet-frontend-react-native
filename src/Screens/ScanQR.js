import { useState, useRef, useReducer } from "react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera, FlashMode } from "expo-camera";
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
} from "react-native";

import FormPin from "../Components/formPin";
import ModalTransferSuccess from "../Components/modalTransactionSuccess";
import { GetUser } from "../Components/Common/Hooks/getUser";

const cameraEffects = [
  { id: "auto", property: "Auto" },
  { id: "sunny", property: "Sunny" },
  { id: "cloudy", property: "Cloudy" },
  { id: "shadow", property: "Shadow" },
  { id: "incandescent", property: "Incandescent" },
  { id: "fluorescent", property: "Fluorescent" },
];

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

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { zoomValue, whiteBalance, cameraType, flash } = state;
  const camera = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTransferSuccess, setModalTransferSuccess] = useState(false);
  const [dataTransferSuccess, setDataTransferSuccess] = useState({
    visible: false,
    data: {},
  });
  const [form, setForm] = useState(null);
  const [error, setError] = useState({ pin: "", balance: "" });

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
    setForm(JSON.parse(data.data))
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

  const handleWhiteBalance = (value) => {
    if (value.length > 0) {
      dispatch({ type: "@type/WH_BALANCE", payload: value });
    }
  };

  const zoomEffect = (value) => {
    dispatch({ type: "@type/ZOOM", payload: value });
  };

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
      <Camera
        style={styles.cameraView}
        ref={camera}
        ratio="16:9"
        autoFocus={true}
        zoom={zoomValue}
        whiteBalance={whiteBalance}
        type={cameraType}
        flashMode={flash}
        onBarCodeScanned={(data) => handleScanQR(data)}
      >
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
            <View style={styles.contentCameraEffects}>
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
            </View>
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
      </Camera>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerScanQr: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
  },
  contentZoomSlider: {
    width: "100%",
    position: "relative",
    top: 460,
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
