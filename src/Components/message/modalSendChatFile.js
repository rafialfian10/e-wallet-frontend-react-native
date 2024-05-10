import { useRef } from "react";
import { Video, ResizeMode } from "expo-av";
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
  Pressable,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

import HandleOpenDocument from "./handleOpenDocument";

function ModalSendChatFile({
  form,
  setForm,
  modalChatFile,
  closeModalChatFile,
  onSendMessage,
}) {
  const video = useRef(null);

  const { height } = Dimensions.get("window");
  const videoHeight = height * 0.8;

  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });
  };

  const deleteFile = (index) => {
    const updatedFiles = form?.files.filter((file, i) => i !== index);
    handleChange("files", updatedFiles);
  };

  const handleSendFileMessage = () => {
    if (form?.message !== "" || form?.files?.length !== 0) {
      onSendMessage(form);
      setForm({
        contacts: null,
        message: "",
        files: [],
      });
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalChatFile}>
        <View
          style={[
            styles.modalViewChatFile,
            {
              backgroundColor: form?.files?.some(
                (file) => file?.extension !== undefined
              )
                ? "#000000"
                : "#FFFFFF",
            },
          ]}
        >
          <TouchableOpacity
            style={styles.btnCloseModalSendFile}
            onPress={closeModalChatFile}
          >
            <AntDesign name="closecircleo" size={30} color="#000000" />
          </TouchableOpacity>
          <ScrollView style={styles.contentFiles}>
            {form?.files?.map((file, i) => {
              return file?.extension && file?.extension !== undefined ? (
                file?.extension === ".jpg" ? (
                  <Image
                    key={i}
                    source={{ uri: file?.uri }}
                    alt={file?.fileName}
                    style={{ aspectRatio: file?.width / file?.height }}
                  />
                ) : (
                  <Video
                    key={i}
                    style={{ width: "100%", height: videoHeight }}
                    ref={video}
                    source={{ uri: file?.uri }}
                    isLooping={true}
                    useNativeControls={true}
                    resizeMode={ResizeMode.COVER}
                  />
                )
              ) : (
                <View key={i} style={styles.files}>
                  <AntDesign name="file1" size={30} color="black" />
                  <Text style={styles.filename}>
                    {file?.fileName?.length > 30
                      ? file?.fileName.substring(0, 30) + "..."
                      : file?.fileName}
                  </Text>
                  <MaterialIcons
                    name="cancel"
                    size={20}
                    color="#F75964"
                    onPress={() => deleteFile(i)}
                    style={styles.deleteIcon}
                  />
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.contentBtnChat}>
            <TextInput
              placeholder="Add information"
              multiline={true}
              style={styles.inputChat}
              onChangeText={(value) => handleChange("message", value)}
              value={form?.message}
            />
            <View style={styles.contentIcon}>
              {form?.files?.some((file) => file?.extension !== undefined) ? (
                ""
              ) : (
                <TouchableOpacity
                  style={styles.iconAttachFile}
                  onPress={() => HandleOpenDocument({ form, setForm })}
                >
                  <MaterialCommunityIcons
                    name="image-plus"
                    size={24}
                    color="#808080"
                  />
                </TouchableOpacity>
              )}
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
  },
  btnCloseModalSendFile: {
    position: "absolute",
    width: 31,
    height: 31,
    margin: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#C9C4C3",
    zIndex: 10,
  },
  contentFiles: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 30,
    display: "flex",
    flexDirection: "column",
  },
  files: {
    marginHorizontal: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  filename: {
    marginHorizontal: 5,
  },
  deleteIcon: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  contentBtnChat: {
    width: "95%",
    position: "absolute",
    bottom: 10,
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
    backgroundColor: "#FFFFFF",
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
