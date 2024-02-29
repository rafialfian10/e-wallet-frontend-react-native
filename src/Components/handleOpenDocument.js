import * as DocumentPicker from "expo-document-picker";

async function HandleOpenDocument({ form, setForm }) {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      // multiple: true,
    });

    delete result.cancelled;

    if (!result.canceled) {
      const fileUri = result.assets[0];

      setForm({
        ...form,
        file: fileUri,
      });
    }

  } catch (error) {
    console.log("file failed to select", error);
  }
}

export default HandleOpenDocument;
