import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

async function HandleOpenDocument({ form, setForm }) {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
      type: "*/*",
    });

    delete result.cancelled;

    if (!result.canceled) {
      const files = await Promise.all(
        result?.assets?.map(async (asset) => {
          const base64 = await FileSystem.readAsStringAsync(asset?.uri, { encoding: FileSystem?.EncodingType?.Base64 });

          return {
            uri: asset?.uri,
            fileName: asset?.name,
            fileType: asset?.mimeType,
            fileSize: asset?.size,
            base64: base64,
          };
        })
      );

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
