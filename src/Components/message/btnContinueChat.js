import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { TouchableOpacity } from "react-native";

function BtnContinueChat({ file, form, setForm, setShowChat }) {
  const handleContinueSendChat = async (file) => {
    try {
      setShowChat(false);

      const cacheDirectory  = await FileSystem.cacheDirectory;
      const fileUri = `${cacheDirectory}/ExperienceData/%2540anonymous%252Fe-wallet-665e0f0d-3faa-4a02-a81e-d2ad99be1865/Camera/${file?.fileName}`;

      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem?.EncodingType?.Base64,
      });

      const dataFiles = {
        uri: file?.filePath,
        fileName: file?.fileName,
        base64: base64,
        extension: file?.extension,
      };

      setForm({
        ...form,
        files: [...form.files, dataFiles],
      });
    } catch (err) {
      console.log(err, "error continue send file");
    }
  };

  return (
    <TouchableOpacity onPress={() => handleContinueSendChat(file)}>
      <Ionicons name="arrow-redo-sharp" size={24} color="#808080" />
    </TouchableOpacity>
  );
}

export default BtnContinueChat;
