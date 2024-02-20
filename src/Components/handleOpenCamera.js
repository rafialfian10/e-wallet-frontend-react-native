import * as ImagePicker from "expo-image-picker";

async function HandleOpenCamera({ form, setForm }) {
  try {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    delete result.cancelled;

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setForm({
        ...form,
        file: imageUri,
      });
    }
  } catch (error) {
    console.log("camera error", error);
  }
}

export default HandleOpenCamera;
