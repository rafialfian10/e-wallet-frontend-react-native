import { useState } from "react";
import { Ionicons, MaterialIcons, EvilIcons } from "@expo/vector-icons";
import { StyleSheet, View, TextInput, Pressable } from "react-native";

import HandleOpenGallery from "./handleOpenGallery";
import HandleOpenCamera from "./handleOpenCamera";

function BtnSendChat({ onSendMessage }) {
  const [form, setForm] = useState({
    message: "",
    file: "",
  });

  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });
  };

  const handleSendMessage = () => {
    if (form.message.trim() !== "" || form.file.trim() !== "") {
      onSendMessage(form);
      setForm({
        message: "",
        file: "",
      });
    }
  };

  return (
    <View style={styles.contentBtnChat}>
      <TextInput
        placeholder="Type a message"
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
            onPress={() => HandleOpenGallery({ form, setForm })}
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
    position: "relative",
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
    height: 50,
    paddingLeft: 10,
    paddingRight: 40,
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
