import { useEffect } from "react";
import { Camera } from "expo-camera";
import { StyleSheet, View } from "react-native";

function TakeCameraView({ camera, zoomValue, whiteBalance, flash, cameraType }) {
  const [permission, setPermission] = Camera.useCameraPermissions();

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

  return (
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
  );
}

const styles = StyleSheet.create({
  modalCamera: {
    flex: 1,
  },
});

export default TakeCameraView;
