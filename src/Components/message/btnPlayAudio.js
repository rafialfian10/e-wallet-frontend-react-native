import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import FormattedTime from "./formattedTime";

function BtnPlayAudio({ file, index }) {
  const [sound, setSound] = useState();
  const [playingAudio, setPlayingAudio] = useState(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pausedPosition, setPausedPosition] = useState(0);

  async function playSound(file) {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: file?.filePath });
      setSound(sound);

      // Continue from paused position if exists
      if (pausedPosition) {
        await sound.playFromPositionAsync(pausedPosition);
        setPausedPosition(0);
      } else {
        await sound.playAsync();
      }

      setPlayingAudio(index);
      sound.setOnPlaybackStatusUpdate(handlePlayProgress);
    } catch (error) {
      console.log("Error playing sound: ", error);
    }
  }

  async function pauseSound() {
    try {
      if (sound && playingAudio !== null) {
        const status = await sound.getStatusAsync();
        if (status.isPlaying) {
          await sound.pauseAsync();
          setPausedPosition(status.positionMillis); // Store current position
          setPlayingAudio(null);
        }
      }
    } catch (error) {
      console.log("Error pausing sound: ", error);
    }
  }

  const handlePlayProgress = (status) => {
    if (!status.isPlaying && status.didJustFinish) {
      // Stop sound and reset state
      pauseSound();
      setPlayingAudio(null);
      setDuration(0);
      setProgress(0);
    } else {
      // Update progress and duration
      setDuration(status.positionMillis);
      setProgress(status.positionMillis / status.durationMillis);

      // auto reset sound if finished
      if (status.didJustFinish) {
        pauseSound();
      }
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View>
      <View style={styles.contentPlayAudio}>
        <TouchableOpacity
          onPress={() => {
            if (playingAudio === index) {
              pauseSound();
            } else {
              playSound(file, index);
            }
          }}
        >
          <Ionicons
            name={playingAudio === index ? "pause" : "play"}
            size={20}
            color="#808080"
          />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress * 100}%` }]} />
        </View>
      </View>
      <Text style={styles.textTimerAudio}>
        <Text style={styles.textTimerAudio}>
          {playingAudio === index
            ? FormattedTime(
                playingAudio === index
                  ? pausedPosition !== 0
                    ? pausedPosition
                    : duration
                  : 0
              )
            : FormattedTime(pausedPosition || file.duration)}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contentPlayAudio: {
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBar: {
    width: 200,
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
  textTimerAudio: {
    color: "#000000",
    fontSize: 10,
  },
});

export default BtnPlayAudio;
