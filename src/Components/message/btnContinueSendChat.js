import { Video, ResizeMode } from "expo-av";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
} from "react-native";

function BtnContinueSendChat({ form, setForm, setChecklist }) {
  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });
  };

  const handleDeleteFile = () => {
    setForm({
      contacts: null,
      message: "",
      files: [],
    });
    setChecklist({
      check: false,
      activeContactId: null,
    })
  };

  const handleContinueSendChat = (formData) => {
    const dataFiles = form?.files?.map((file) => ({
      uri: file?.uri,
      fileName: file?.fileName,
      base64: file?.base64,
      extension: file?.extension,
    }));

    const data = {
      message: formData?.message,
      files: dataFiles,
      recipientId: formData?.contacts?.id,
    };

    // emit event for send message
    socket.emit("send message", data);

    setForm({
      contacts: null,
      message: "",
      files: [],
    });
    setChecklist({
      check: false,
      activeContactId: null,
    })
  };

  return (
    <View style={styles.containerBtnContinueSendChat}>
      <Pressable style={styles.btnDeleteFile} onPress={handleDeleteFile}>
        <AntDesign name="delete" size={20} color="#F55676" />
      </Pressable>
      <View style={styles.contentFileContinueSendChat}>
        {form?.files[0].extension === ".jpg" ? (
          <Image
            style={styles.fileContinueSendChat}
            source={{ uri: form?.files[0]?.uri }}
            alt={form?.files[0]?.fileName}
          />
        ) : (
          <Video
            style={styles.fileContinueSendChat}
            source={{ uri: form?.files[0]?.uri }}
            isLooping={true}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
          />
        )}
        <TextInput
          style={styles.inputContinueSendChat}
          placeholder="Type a message"
          multiline={true}
          onChangeText={(value) => handleChange("message", value)}
          value={form.message}
        />
      </View>
      {form?.contacts !== null ? (
        <View style={styles.contentBtnContinueSendChat}>
          <Text style={styles.textContinueSendChat}>
            {form?.contacts?.phone}
          </Text>
          <Pressable
            style={styles.btnContinueSendChat}
            onPress={() => handleContinueSendChat(form)} 
          >
            <Ionicons name="send" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  containerBtnContinueSendChat: {
    width: "95%",
    position: "absolute",
    bottom: 0,
    marginBottom: 5,
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    zIndex: 10,
  },
  btnDeleteFile: {
    paddingVertical: 10,
    display: "flex",
    alignItems: "flex-end",
  },
  contentFileContinueSendChat: {
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileContinueSendChat: {
    width: "20%",
    height: 70,
    borderRadius: 10,
  },
  inputContinueSendChat: {
    width: "78%",
    height: 70,
    padding: 10,
    textAlign: "left",
    textAlignVertical: "top",
    borderRadius: 5,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    borderBottomColor: "green",
    borderBottomWidth: 2,
    elevation: 2,
    shadowOpacity: 0.75,
    shadowRadius: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  contentBtnContinueSendChat: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContinueSendChat: {
    paddingHorizontal: 5,
    fontSize: 14,
  },
  btnContinueSendChat: {
    width: "14%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#38B03E",
  },
});

export default BtnContinueSendChat;
