import * as DocumentPicker from "expo-document-picker";

async function HandleOpenDocument({ form, setForm }) {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      multiple: true,
    });

    delete result.cancelled;

    if (!result.canceled) {
      // const fileUri = result.assets;
      const files = result.assets.map(asset => ({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
        size: asset.size,
      }));

      setForm({
        ...form,
        files: [...form.files, ...files],
      });
    }

  } catch (error) {
    console.log("file failed to select", error);
  }
}

export default HandleOpenDocument;
