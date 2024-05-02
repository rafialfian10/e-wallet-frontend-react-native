import { useRef } from "react";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { StyleSheet, Pressable } from "react-native";

function BtnRecordAudio({
  form,
  userContact,
  adminContact,
  recording,
  setRecording,
  isRecording,
  setIsRecording,
  setInfoRecording,
  onRecordingProgress,
}) {
  const holdTimeout = useRef(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        await requestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recording.setOnRecordingStatusUpdate(onRecordingProgress)

      setIsRecording(true);
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    // console.log("Stopping recording..");
    setIsRecording(false);
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const base64 = await FileSystem.readAsStringAsync(recording?.getURI(), {
      encoding: FileSystem?.EncodingType?.Base64,
    });

    const dataFiles = [{
      uri: recording.getURI(),
      fileName: `recording-${Date.now()}.${recording._options.android.extension}`,
      fileType: recording._options.web.mimeType,
      // fileSize: 100,
      base64: base64,
      duration: recording._finalDurationMillis,
    }];

    const data = {
      message: form?.message,
      files: dataFiles,
      recipientId: userContact?.id || adminContact?.id,
    };

    // emit event for send message
    socket.emit("send message", data);
  }

  function handlePressIn() {
    holdTimeout.current = setTimeout(() => {
      startRecording();
    }, 300);
  }

  function handlePressOut() {
    if (isRecording) {
      clearTimeout(holdTimeout.current);
      stopRecording();
    }
  }

  const handleInfoRecordAudio = () => {
    setInfoRecording(true);
    setTimeout(() => {
      setInfoRecording(false);
    }, 1000);
  };

  return (
    <Pressable
      style={styles.btnSend}
      onPress={handleInfoRecordAudio}
      onLongPress={handlePressIn}
      onPressOut={handlePressOut}
    >
      <FontAwesome
        name={!isRecording ? "microphone" : "microphone-slash"}
        size={22}
        color="#FFFFFF"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
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

export default BtnRecordAudio;
