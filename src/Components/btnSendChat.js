import { useContext } from "react";
import { Ionicons, MaterialIcons, EvilIcons } from "@expo/vector-icons";
import { StyleSheet, View, TextInput, Pressable } from "react-native";

import HandleOpenDocument from "./handleOpenDocument";
import HandleOpenCamera from "./handleOpenCamera";
// import { UserContext } from "../Context/UserContext";
// import { API } from "../Config/Api";

function BtnSendChat({ userContact, adminContact, form, setForm, onSendMessage }) {
  // const [state, dispatch] = useContext(UserContext);

  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });
  };

  const handleSendMessage = () => {
    if (form.message !== "" || form.files.length !== 0) {
      onSendMessage(form);
      setForm({
        message: "",
        files: [],
      });
    }
  };

  // const handleSendMessage = async () => {
  //   try {
  //     const config = {
  //       headers: {
  //         "Content-type": "multipart/form-data",
  //         Authorization: "Bearer " + state?.user?.token,
  //       },
  //     };

  //     const formData = new FormData();
  //     formData.append("message", form.message || "");
  //     formData.append("recipientId", form.recipientId);
  //     form.files.map((file) => {
  //       formData.append("files", {
  //         uri: file.uri,
  //         name: file.name,
  //         type: file.mimeType,
  //       });
  //     });

  //     const response = await API.post(`/chat`, formData, config);
  //     if (response?.data?.status === 200) {
  //       setForm({
  //         message: "",
  //         files: [],
  //         recipientId: userContact?.id || adminContact?.id,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     alert("Failed to send message. Please check your network connection.");
  //   }
  // };

  return (
    <View style={styles.contentBtnChat}>
      <TextInput
        placeholder="Type a message"
        multiline={true}
        style={styles.inputChat}
        onChangeText={(value) => handleChange("message", value)}
        value={form.message}
      />
      <View style={styles.contentIcon}>
        <Pressable style={styles.iconAttachFile}>
          <MaterialIcons
            name="attach-file"
            size={22}
            color="#808080"
            onPress={() => HandleOpenDocument({ form, setForm })}
          />
        </Pressable>
        {form.message !== "" ? (
          <View></View>
        ) : (
          <Pressable style={styles.iconCamera}>
            <EvilIcons
              name="camera"
              size={28}
              color="#808080"
              onPress={() => HandleOpenCamera({ form, setForm })}
            />
          </Pressable>
        )}
      </View>
      <Pressable onPress={handleSendMessage} style={styles.btnSend}>
        <Ionicons name="send" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contentBtnChat: {
    width: "95%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    zIndex: 10,
  },
  inputChat: {
    width: "85%",
    paddingLeft: 10,
    paddingRight: 40,
    paddingVertical: 10,
    textAlign: "left",
    textAlignVertical: "center",
    borderRadius: 25,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  contentIcon: {
    position: "absolute",
    right: 70,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  iconAttachFile: {},
  iconCamera: {
    marginLeft: 10,
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

export default BtnSendChat;
