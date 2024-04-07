import * as DocumentPicker from "expo-document-picker";
import { Buffer } from 'buffer';


async function HandleOpenDocument({ form, setForm }) {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      base64: true,
      // copyToCacheDirectory: false,
      // type: "*/*",
    });

    delete result.cancelled;

    if (!result.canceled) {
      const files = result?.assets?.map((asset) => {
        const base64 = Buffer.from(asset?.uri, 'binary').toString('base64');
        console.log(base64);

        return {
          uri: asset?.uri,
          fileName: asset?.name,
          fileType: asset?.mimeType,
          fileSize: asset?.size,
          base64: base64,
        };
      });

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
