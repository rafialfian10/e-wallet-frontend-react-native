import { useState } from "react";
import {
  Ionicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  EvilIcons,
} from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
} from "react-native";

import HandleOpenDocument from "./handleOpenDocument";
import BtnRecordAudio from "./btnRecordAudio";
import ModalCamera from "./modalCamera";
import FormattedTime from "./formattedTime";
import ShowHideAnimation from "./showHideAnimation";
import HandleOpenCamera from "./handleOpenCamera";

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
  const [modalCameraVisible, setModalCameraVisible] = useState(false);

  // animation
  const { showHideAnim } = ShowHideAnimation();

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
        style={styles.inputChat}
        placeholder={
          isRecording ? FormattedTime(recordedTime) : "Type a message"
        }
        placeholderTextColor={isRecording ? "#F55676" : "#808080"}
        multiline={true}
        onChangeText={(value) => handleChange("message", value)}
        value={form.message}
      />
      {isRecording ? (
        <View style={styles.contentMicrophone}>
          <Animated.View
            style={[styles.microphoneAnim, { opacity: showHideAnim }]}
          >
            <FontAwesome name="microphone" size={22} color="#F55676" />
          </Animated.View>
          <AntDesign
            name="left"
            size={11}
            color="#808080"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.textRecordCancel}>Swipe to cancel</Text>
        </View>
      ) : (
        <View style={styles.contentIcon}>
          <Pressable onPress={() => HandleOpenDocument({ form, setForm })}>
            <MaterialIcons name="attach-file" size={22} color="#808080" />
          </Pressable>
          {form.message !== "" ? (
            <View></View>
          ) : (
            <Pressable
              style={styles.iconCamera}
              onPress={() => setModalCameraVisible(true)}
              // onPress={() => HandleOpenCamera({ form, setForm })}
            >
              <EvilIcons name="camera" size={28} color="#808080" />
            </Pressable>
          )}
        </View>
      )}
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

      {modalCameraVisible && (
        <ModalCamera
          form={form}
          setForm={setForm}
          modalCameraVisible={modalCameraVisible}
          closeModalCamera={() => setModalCameraVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentBtnChat: {
    width: "95%",
    position: "relative",
    bottom: 0,
    marginBottom: 5,
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
    paddingLeft: 35,
    paddingRight: 40,
    paddingVertical: 10,
    textAlign: "left",
    textAlignVertical: "center",
    borderRadius: 25,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  contentMicrophone: {
    width: "100%",
    position: "absolute",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  microphoneAnim: {
    marginRight: 110,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textRecordCancel: {
    fontSize: 12,
    color: "#808080",
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
