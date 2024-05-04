import { useState, useEffect, useRef, useReducer } from "react";
import Slider from "@react-native-community/slider";
import { Camera } from "expo-camera";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import {
  StyleSheet,
  ScrollView,
  View,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

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

function ModalCamera({
  form,
  setForm,
  onSendMessage,
  modalCameraVisible,
  closeModalCamera,
}) {
  const [permission, setPermission] = Camera.useCameraPermissions();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { zoomValue, whiteBalance, cameraType, flash } = state;
  const [activeEffect, setActiveEffect] = useState(null);
  const camera = useRef(null);

  const cameraEffects = [
    { id: "auto", property: "Auto" },
    { id: "sunny", property: "Sunny" },
    { id: "cloudy", property: "Cloudy" },
    { id: "shadow", property: "Shadow" },
    { id: "incandescent", property: "Incandescent" },
    { id: "fluorescent", property: "Fluorescent" },
  ];

  useEffect(() => {
    const getCameraPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setPermission(cameraPermission);
    };

    getCameraPermissions();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return;
  }

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

  const handleWhiteBalance = (value) => {
    setActiveEffect(value);
    if (value.length > 0) {
      dispatch({ type: "@type/WH_BALANCE", payload: value });
    }
  };

  const handleTakePhoto = async () => {
    if (camera.current) {
      const result = {
        quality: 1,
        base64: true,
        skipProcessing: true,
        isImageMirror: true,
      };
      let photo = await camera.current.takePictureAsync(result);

      // catch file name
      const uriParts = photo.uri.split("/");
      const fileName = uriParts[uriParts.length - 1];

      const form = {
        message: "",
        files: [
          {
            uri: photo.uri,
            fileName: fileName,
            fileType: "image/jpeg",
            base64: photo.base64,
            type: "image",
          },
        ],
      };

      if (photo) {
        onSendMessage(form);
        setForm({
          message: "",
          files: [],
        });
        closeModalCamera();
      }
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCameraVisible}
      >
        <Camera
          style={styles.modalCamera}
          ref={camera}
          autoFocus={true}
          ratio="16:9"
          zoom={zoomValue}
          whiteBalance={whiteBalance}
          flashMode={flash}
          type={cameraType}
        >
          <View style={styles.contentFlipFlash}>
            <View style={styles.subContentFlipFlash}>
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
            </View>
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
              <View style={styles.contentCameraEffects}>
                <ScrollView horizontal={true}>
                  {cameraEffects?.map((cameraEffect) => (
                    <TouchableWithoutFeedback
                      key={cameraEffect?.id}
                      onPress={() => handleWhiteBalance(cameraEffect?.id)}
                    >
                      <View style={styles.itemCameraEffect}>
                        <Text
                          style={[
                            styles.textItemCameraEffect,
                            {
                              color:
                                activeEffect === cameraEffect?.id
                                  ? "#E62565"
                                  : "#FFFFFF",
                            },
                          ]}
                        >
                          {cameraEffect?.property}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.contentCameraIcon}>
                <TouchableOpacity onPress={handleTakePhoto}>
                  <FontAwesome name="camera" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Entypo name="video-camera" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModalCamera}>
                  <FontAwesome name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Camera>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: "#FFFFFF",
  },
  modalCamera: {
    flex: 1,
  },
  contentFlipFlash: {
    width: "100%",
    position: "absolute",
    top: 0,
    backgroundColor: "#000000",
    opacity: 0.5,
  },
  subContentFlipFlash: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  contentZoomSlider: {
    width: "100%",
    position: "absolute",
    top: 550,
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
  },
  contentCameraIcon: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textCameraPermission: {
    alignSelf: "center",
  },
});

export default ModalCamera;
