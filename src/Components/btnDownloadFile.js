import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

function BtnDownloadFile({ file }) {
  const handleDownloadFile = async () => {
    try {
      const result = await FileSystem.downloadAsync(
        file?.filePath,
        FileSystem.documentDirectory + file?.fileName
      );

      saveFile(result.uri, file?.fileName, result.headers["Content-Type"]);
    } catch (error) {
      console.error(error);
    }
  };

  async function saveFile(uri, fileName, headers) {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          headers
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch((e) => console.log(e));
      } else {
        // Sharing.shareAsync(uri);
        console.log("download failed");
      }
    } else {
      Sharing.shareAsync(uri);
    }
  }

  return (
    <TouchableOpacity
      style={styles.btnDownloadFile}
      onPress={() => handleDownloadFile(file)}
    >
      <MaterialCommunityIcons name="download" size={20} color="#000000" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnDownloadFile: {
    marginRight: 5,

  },
});

export default BtnDownloadFile;
