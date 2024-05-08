import { useState, useRef } from "react";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { StyleSheet, Pressable, Animated, PanResponder } from "react-native";

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
  const [isLongPress, setIsLongPress] = useState(false);
  const [holdAndDrag, setHoldAndDrag] = useState(false);

  // animation
  const btnWidthAnim = useRef(new Animated.Value(50)).current;
  const btnHeightAnim = useRef(new Animated.Value(50)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  // console.log("recording 1", isLongPress);

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

      recording.setOnRecordingStatusUpdate(onRecordingProgress);

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

    const dataFiles = [
      {
        uri: recording.getURI(),
        fileName: `recording-${Date.now()}.${
          recording._options.android.extension
        }`,
        fileType: recording._options.web.mimeType,
        // fileSize: 100,
        base64: base64,
        duration: recording._finalDurationMillis,
        extension: recording._options.android.extension,
      },
    ];

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

      if (!holdAndDrag) {
        setIsLongPress(true);
        Animated.parallel([
          Animated.timing(btnWidthAnim, {
            toValue: 100,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(btnHeightAnim, {
            toValue: 100,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      }
    }, 300);
  }

  function handlePressOut() {
    if (isRecording) {
      stopRecording();
      clearTimeout(holdTimeout.current);
    }

    Animated.parallel([
      Animated.timing(btnWidthAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(btnHeightAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
    setIsLongPress(false);
  }

  const handleInfoRecordAudio = () => {
    setInfoRecording(true);
    setTimeout(() => {
      setInfoRecording(false);
    }, 1000);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      // onMoveShouldSetPanResponderCapture: (_, gestureState) =>
      //   isLongPress && gestureState.dx !== 0,
      onPanResponderMove: (_, gestureState) => {
        console.log(isLongPress);
        const { dx, dy } = gestureState;
        if (dx < 0 && Math.abs(dx) <= 150 && Math.abs(dy) < 50) {
          pan.setValue({ x: dx, y: 0 }); // Mulai animasi ketika tombol digeser ke kiri
          if (holdTimeout.current) {
            setHoldAndDrag(true);
          }
        } else {
          setHoldAndDrag(false);
        }
      },
      onPanResponderRelease: async (_, gestureState) => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 }, // Kembalikan object ke posisi awal
          useNativeDriver: false,
        }).start();

        setHoldAndDrag(false);

        // cancel record jika di drag -150px
        if (gestureState.dx <= -150) {
          // if (isRecording) {
          try {
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: false,
            });
          } catch (err) {
            console.log(err, "failed to stop recording");
          }
          // }

          console.log("recording 2", recording);

          setRecording(undefined);
          setIsRecording(false);
          clearTimeout(holdTimeout.current);

          Animated.parallel([
            Animated.timing(btnWidthAnim, {
              toValue: 50,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(btnHeightAnim, {
              toValue: 50,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();
        } else {
          console.log("record start");
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.btnSendAnim,
        {
          width: btnWidthAnim,
          height: btnHeightAnim,
          position: "absolute",
          right: isRecording ? -20 : 0,
          // transform: pan.getTranslateTransform(),
        },
      ]}
      // {...panResponder.panHandlers}
    >
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btnSendAnim: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#38B03E",
    borderRadius: 50,
  },
  btnSend: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});

export default BtnRecordAudio;
