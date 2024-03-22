import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  ScrollView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";

function ModalSendChatFile({ form, setForm, onSendMessage, modalChatFile, closeModalChatFile }) {
  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });
  };

  const deleteFile = (index) => {
    const updatedFiles = form.files.filter((file, i) => i !== index);
    handleChange('files', updatedFiles);
  };

  const handleSendFileMessage = () => {
    if (form.message !== "" || form.files.length !== 0) {
      onSendMessage(form);
      setForm({
        message: "",
        files: [],
      });
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalChatFile}
      >
        <View style={styles.modalViewChatFile}>
          <TouchableOpacity
            style={styles.btnCloseModalSendFile}
            onPress={closeModalChatFile}
          >
            <AntDesign name="closecircleo" size={30} color="#000000" />
          </TouchableOpacity>

          <ScrollView style={styles.contentFiles}>
            {form.files.map((file, i) => (
              <View key={i} style={styles.files}>
                <AntDesign name="file1" size={30} color="black" />
                <Text style={styles.filename}>{file?.name.length > 30 ? file?.name.substring(0, 30) + "..." : file?.name}</Text>
                <MaterialIcons name="cancel" size={16} color="#F75964" onPress={() => deleteFile(i)} />
              </View>
            ))}
          </ScrollView>

          <View style={styles.contentBtnChat}>
            <TextInput
              placeholder="Add information"
              multiline={true}
              style={styles.inputChat}
              onChangeText={(value) => handleChange("message", value)}
              value={form.message}
            />
            <View style={styles.contentIcon}>
              <Pressable style={styles.iconAttachFile}>
                <MaterialCommunityIcons
                  name="image-plus"
                  size={24}
                  color="#808080"
                />
              </Pressable>
            </View>
            <Pressable style={styles.btnSend} onPress={handleSendFileMessage}>
              <Ionicons name="send" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: "#FFFFFF",
  },
  modalViewChatFile: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  btnCloseModalSendFile: {
    width: 30,
    height: 30,
    margin: 10,
    borderRadius: 50,
    backgroundColor: "#C9C4C3",
  },
  contentFiles: {
    marginTop: 20,
    marginBottom: 80,
    marginHorizontal: 10,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "column",
  },
  files: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  filename: {
    marginHorizontal: 5,
  },
  contentBtnChat: {
    width: "95%",
    position: "absolute",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
  },
  inputChat: {
    width: "85%",
    paddingLeft: 40,
    paddingRight: 10,
    paddingVertical: 10,
    textAlign: "left",
    textAlignVertical: "center",
    borderRadius: 25,
    fontSize: 14,
    backgroundColor: "#F5F5F5",
  },
  contentIcon: {
    position: "absolute",
    left: 10,
  },
  btnSend: {
    width: "14%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#38B03E",
  },
});

export default ModalSendChatFile;
