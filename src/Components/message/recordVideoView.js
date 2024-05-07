import { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { StyleSheet, View, Text } from "react-native";

import FormattedTime from "./formattedTime";

function RecordVideoView({ camera, zoomValue, whiteBalance, flash, cameraType }) {
  const [cameraPermission, setCameraPermission] = useState();
  const [microphonePermission, setMicrophonePermission] = useState();
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setCameraPermission(cameraPermission.status === "granted");
      setMicrophonePermission(microphonePermission.status === "granted");
      setMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (
    cameraPermission === undefined ||
    microphonePermission === undefined ||
    mediaLibraryPermission === undefined
  ) {
    return <View />;
  }

  if (!cameraPermission || !mediaLibraryPermission || !mediaLibraryPermission) {
    return;
  }

  return (
    <View style={styles.contentRecordVideo}>
      <Camera
        style={styles.modalCamera}
        ref={camera}
        autoFocus={true}
        ratio="16:9"
        zoom={zoomValue}
        whiteBalance={whiteBalance}
        flashMode={flash}
        type={cameraType}
      />
      {/* <Text style={styles.textDuration}>{FormattedTime(50000)}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  modalCamera: {
    flex: 1,
  },
  contentRecordVideo: {
    flex: 1,
  },
  textDuration: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default RecordVideoView;
