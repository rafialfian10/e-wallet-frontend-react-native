import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  Modal,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

function PreviewImage({ file }) {
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);

  const toggleFullScreenImage = () => {
    setShowFullScreenImage(!showFullScreenImage);
  };

  return (
    <View>
      <Pressable onPress={toggleFullScreenImage}>
        <Image
          style={styles.filePhoto}
          source={{ uri: file?.filePath }}
          alt={file?.fileName}
        />
      </Pressable>
      <Modal
        visible={showFullScreenImage}
        transparent={true}
        onRequestClose={() => setShowFullScreenImage(false)}
      >
        <View style={styles.modalPreviewImage}>
          <Image
            style={styles.fullScreenImage}
            source={{ uri: file?.filePath }}
            resizeMode="contain"
          />
          <Pressable
            style={styles.btnClosePreviewImage}
            onPress={() => setShowFullScreenImage(false)}
          >
            <Ionicons name="close" size={30} color="#FFFFFF" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filePhoto: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
  modalPreviewImage: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
  btnClosePreviewImage: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
});

export default PreviewImage;
