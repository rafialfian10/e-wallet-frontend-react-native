import { useState, useRef, useReducer } from "react";
import Slider from "@react-native-community/slider";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
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

import TakeCameraView from "./takeCameraView";
import RecordVideoView from "./recordVideoView";

const initialState = {
  zoomValue: 0,
  whiteBalance: "auto",
  cameraType: "back",
  flash: "off",
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "@type/WHITE_BALANCE":
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

function ModalCamera({ form, setForm, modalCameraVisible, closeModalCamera }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { zoomValue, whiteBalance, cameraType, flash } = state;

  const camera = useRef(null);
  const [mode, setMode] = useState("camera");
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [activeEffect, setActiveEffect] = useState(null);

  const cameraEffects = [
    { id: "auto", property: "Auto" },
    { id: "sunny", property: "Sunny" },
    { id: "cloudy", property: "Cloudy" },
    { id: "shadow", property: "Shadow" },
    { id: "incandescent", property: "Incandescent" },
    { id: "fluorescent", property: "Fluorescent" },
  ];

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
      dispatch({ type: "@type/WHITE_BALANCE", payload: value });
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

      const dataFiles = {
        uri: photo.uri,
        fileName: fileName,
        fileType: "image/jpeg",
        base64: photo.base64,
        type: "image",
        width: photo.width,
        height: photo.height,
      };

      if (photo) {
        setForm({
          ...form,
          files: [...form.files, dataFiles],
        });
        closeModalCamera();
        camera.current = null;
      }
    }
  };

  const handleRecordVideo = async () => {
    setIsRecordingVideo(true);

    if (camera.current) {
      let result = {
        quality: "1080p",
        maxDuration: 300,
        mute: false,
        // maxFileSize: 100000000, // 100MB in bytes
      };

      const video = await camera.current.recordAsync(result);

      // catch file name
      const uriParts = video.uri.split("/");
      const fileName = uriParts[uriParts.length - 1];

      const base64 = await FileSystem.readAsStringAsync(video?.uri, {
        encoding: FileSystem?.EncodingType?.Base64,
      });

      const dataFiles = {
        uri: video.uri,
        fileName: fileName,
        fileType: "video/mp4",
        base64: base64,
        type: "video",
      };

      if (video) {
        setForm({
          ...form,
          files: [...form.files, dataFiles],
        });

        setIsRecordingVideo(false);
        closeModalCamera();
        camera.current = null;
      }
    }
  };

  let handleStopRecording = () => {
    setIsRecordingVideo(false);
    camera.current.stopRecording();
  };

  // if (video) {
  //   let shareVideo = () => {
  //     Sharing.shareAsync(video.uri).then(() => {
  //       setVideo(undefined);
  //     });
  //   };

  //   let saveVideo = () => {
  //     MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
  //       setVideo(undefined);
  //     });
  //   };

  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <Video
  //         style={styles.video}
  //         source={{ uri: video.uri }}
  //         useNativeControls
  //         resizeMode="contain"
  //         isLooping={true}
  //       />
  //       <Button title="Share" onPress={shareVideo} />
  //       {mediaLibraryPermission ? (
  //         <Button title="Save" onPress={saveVideo} />
  //       ) : undefined}
  //       <Button title="Discard" onPress={() => setVideo(undefined)} />
  //     </SafeAreaView>
  //   );
  // }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCameraVisible}
      >
        {mode === "camera" ? (
          <TakeCameraView
            camera={camera}
            zoomValue={zoomValue}
            whiteBalance={whiteBalance}
            flash={flash}
            cameraType={cameraType}
          />
        ) : (
          <RecordVideoView
            camera={camera}
            zoomValue={zoomValue}
            whiteBalance={whiteBalance}
            flash={flash}
            cameraType={cameraType}
          />
        )}
        <View style={styles.contentSettingCamera}>
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
              <View style={styles.contentCameraNavigation}>
                <TouchableOpacity onPress={() => setMode("camera")}>
                  <Text
                    style={[
                      styles.textCameraNavigation,
                      mode === "camera" ? { color: "red" } : null,
                    ]}
                  >
                    Camera
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode("video")}>
                  <Text
                    style={[
                      styles.textCameraNavigation,
                      mode === "video" ? { color: "red" } : null,
                    ]}
                  >
                    Video
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    closeModalCamera();
                    camera.current = null;
                  }}
                  style={styles.btnClose}
                >
                  <FontAwesome name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.contentCameraIcon}>
                <TouchableOpacity onPress={handleToggleFlipCamera}>
                  <MaterialCommunityIcons
                    name="camera-flip"
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    mode === "camera"
                      ? handleTakePhoto
                      : isRecordingVideo
                      ? handleStopRecording
                      : handleRecordVideo
                  }
                >
                  <Ionicons
                    name={
                      mode === "camera"
                        ? "camera"
                        : isRecordingVideo
                        ? "videocam-off"
                        : "videocam"
                    }
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
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: "#FFFFFF",
  },
  contentSettingCamera: {
    width: "100%",
    height: "auto",
    position: "absolute",
    bottom: 0,
    paddingBottom: 50,
    display: "flex",
    flexDirection: "column",
  },
  contentZoomSlider: {
    width: "100%",
  },
  zoomSlider: {
    width: "100%",
    height: 50,
  },
  contentCameraOption: {
    width: "100%",
    height: "100%",
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
  contentCameraNavigation: {
    position: "relative",
    marginVertical: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  textCameraNavigation: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  btnClose: {
    position: "absolute",
    right: 20,
  },
  contentCameraIcon: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textCameraPermission: {
    alignSelf: "center",
  },
});

export default ModalCamera;
