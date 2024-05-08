import { useState, useEffect, useRef } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import FormattedTime from "./formattedTime";

function BtnPlayVideo({ file }) {
  const video = useRef(null);
  const [status, setStatus] = useState();
  const [progress, setProgress] = useState(0);

  const handleFullscreen = () => {
    if (video.current) {
      video.current.presentFullscreenPlayer();
    }
  };

  useEffect(() => {
    if (status) {
      if (!status?.isPlaying && status?.didJustFinish) {
        setProgress(0);
      } else {
        setProgress(status?.positionMillis / status?.durationMillis);

        if (status?.didJustFinish) {
          video.current.pauseAsync();
        }
      }
    }
  }, [status]);

  return (
    <View style={styles.contentPlayVideo}>
      <Video
        style={styles.fileVideo}
        ref={video}
        source={{ uri: file?.filePath || file?.uri }}
        isLooping={true}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        onPlaybackStatusUpdate={(status) => setStatus(status)}
      />
      <TouchableOpacity
        style={styles.btnPlayVideo}
        onPress={() =>
          status && status.isPlaying
            ? video.current.pauseAsync()
            : video.current.playAsync()
        }
      >
        <AntDesign
          name={status && status.isPlaying ? "pausecircleo" : "playcircleo"}
          size={28}
          color="#FFFFFF"
        />
      </TouchableOpacity>
      {status?.isPlaying ? (
        <View style={styles.contentDurationVideo}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.textDurationVideo}>
            {status && status.isPlaying
              ? FormattedTime(status && status.positionMillis)
              : FormattedTime(status && status.durationMillis)}
          </Text>
          <TouchableOpacity onPress={handleFullscreen}>
            <MaterialIcons name="fullscreen" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contentPlayVideo: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fileVideo: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
  btnPlayVideo: {
    position: "absolute",
    left: "45%",
    zIndex: 10,
  },
  contentDurationVideo: {
    width: "100%",
    position: "absolute",
    bottom: 10,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  progressBar: {
    width: "75%",
    margin: 0,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#A9AAAB",
  },
  progress: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#808080",
  },
  textDurationVideo: {
    fontSize: 12,
    color: "#FFFFFF",
  },
});

export default BtnPlayVideo;
