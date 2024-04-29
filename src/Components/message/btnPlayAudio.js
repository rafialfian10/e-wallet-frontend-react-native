import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import moment from "moment";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

function BtnPlayAudio({ file, index }) {
  const [sound, setSound] = useState();
  const [playingAudio, setPlayingAudio] = useState(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  async function playSound(file) {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: file?.filePath });
      setSound(sound);

    //   console.log("Playing Sound");
      await sound.playAsync();
      setPlayingAudio(index);
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } catch (error) {
      console.log("Error playing sound: ", error);
    }
  }

  async function pauseSound() {
    try {
      if (sound && playingAudio !== null) {
        await sound.pauseAsync();
        setPlayingAudio(null);
      }
    } catch (error) {
      console.log("Error pausing sound: ", error);
    }
  }

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
      // Stop sound and reset state
      pauseSound();
      setProgress(0);
      setDuration(0);
      setPlayingAudio(null);
    } else {
      // Update progress and duration
      setDuration(status.positionMillis);
      setProgress(status.positionMillis / status.durationMillis);
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

  const formattedTime = (time) => {
    const durationMoment = moment.duration(time);
    let formatted = "";

    if (durationMoment.hours() > 0) {
      formatted += durationMoment.hours() + ":";
    }

    formatted +=
      (durationMoment.minutes() < 10 ? "0" : "") +
      durationMoment.minutes() +
      ":";
    formatted +=
      (durationMoment.seconds() < 10 ? "0" : "") + durationMoment.seconds();

    return formatted;
  };

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
      <Text style={styles.textTimerAudio}>{formattedTime(duration)}</Text>
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
