import { useState } from "react";
import { Ionicons, MaterialIcons, EvilIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";

import HandleOpenDocument from "../handleOpenDocument";
import HandleOpenCamera from "../handleOpenCamera";
import BtnRecordAudio from "./btnRecordAudio";

function BtnSendChat({ form, setForm, userContact, adminContact, onSendMessage }) {
  const [infoRecording, setInfoRecording] = useState(false);

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
      {form.message !== "" ? (
        <Pressable onPress={handleSendMessage} style={styles.btnSend}>
          <Ionicons name="send" size={22} color="#FFFFFF" />
        </Pressable>
      ) : (
        <>
          {infoRecording ? (
            <Text style={styles.textInfoRecording}>
              Hold to record, release to send
            </Text>
          ) : (
            ""
          )}
          <BtnRecordAudio
            form={form}
            userContact={userContact}
            adminContact={adminContact}
            setInfoRecording={setInfoRecording}
          />
        </>
      )}
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
  textInfoRecording: {
    position: "absolute",
    bottom: 60,
    right: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#FFFFFF",
    fontSize: 14,
    backgroundColor: "#31353B",
    zIndex: 10,
  },
});

export default BtnSendChat;
