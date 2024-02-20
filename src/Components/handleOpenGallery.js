import * as ImagePicker from "expo-image-picker";

async function HandleOpenGallery({ form, setForm }) {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    delete result.cancelled;
    
    if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setForm({
          ...form, file: imageUri
        })
      } 
  } catch (error) {
    console.log("file failed to select", error);
  }
}

export default HandleOpenGallery;
