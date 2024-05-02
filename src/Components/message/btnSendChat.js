import { useState } from "react";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  EvilIcons,
} from "@expo/vector-icons";
import { StyleSheet, View, Text, TextInput, Pressable, Animated } from "react-native";

import HandleOpenDocument from "../handleOpenDocument";
import HandleOpenCamera from "../handleOpenCamera";
import BtnRecordAudio from "./btnRecordAudio";

import FormattedTime from "./formattedTime";
import ShowHideAnimation from "./showHideAnimation";

function BtnSendChat({
  form,
  setForm,
  userContact,
  adminContact,
  onSendMessage,
}) {
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [infoRecording, setInfoRecording] = useState(false);

  // animation
  const { fadeAnim } = ShowHideAnimation();

  const handleRecordingProgress = (status) => {
    if (status && status.durationMillis) {
      setRecordedTime(status.durationMillis);
    }
  };

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
        placeholder={
          !recording ? "Type a message" : FormattedTime(recordedTime)
        }
        placeholderTextColor={!recording ? "#000000" : "#F55676"}
        multiline={true}
        style={styles.inputChat}
        onChangeText={(value) => handleChange("message", value)}
        value={form.message}
      />
      {recording && (
        <Animated.View
          style={[styles.contentMicrophone, { opacity: fadeAnim }]}
        >
          <FontAwesome name="microphone" size={22} color="#F55676" />
        </Animated.View>
      )}
      <View style={styles.contentIcon}>
        <Pressable>
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
            recording={recording}
            setRecording={setRecording}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            setInfoRecording={setInfoRecording}
            onRecordingProgress={handleRecordingProgress}
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
    paddingLeft: 30,
    paddingRight: 40,
    paddingVertical: 10,
    textAlign: "left",
    textAlignVertical: "center",
    borderRadius: 25,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  contentMicrophone: {
    position: "absolute",
    left: 10,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  contentIcon: {
    position: "absolute",
    right: 70,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
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
