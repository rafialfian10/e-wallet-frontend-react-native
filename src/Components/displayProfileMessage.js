import { useEffect, useState } from "react";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";

import { PATH_FILE } from "@env";

function DisplayProfileMessage({ user }) {
  const [newURLPhoto, setNewURLPhoto] = useState();

  useEffect(() => {
    if (user?.photo) {
      const updatedPhotoURL = user?.photo.replace(
        "http://localhost:5000",
        PATH_FILE
      );

      setNewURLPhoto((prevForm) => ({
        ...prevForm,
        photo: updatedPhotoURL,
      }));
    }
  }, [user]);

  return (
    <View style={styles.contentProfile}>
      <Ionicons name="arrow-back-outline" size={24} color="#000000" />
      <Pressable style={styles.contentPhoto}>
        {newURLPhoto?.photo &&
        newURLPhoto?.photo !== `${PATH_FILE}/static/photo/null` ? (
          <Image
            source={{ uri: newURLPhoto?.photo }}
            style={styles.photo}
            alt="photo"
          />
        ) : (
          <Image
            source={require("../../assets/default-photo.png")}
            style={styles.photo}
            alt="photo"
          />
        )}
      </Pressable>
      <View style={styles.contentUsername}>
        <Text style={styles.textUsername}>Admin</Text>
        <View style={styles.contentOnline}>
          <Fontisto name="ellipse" size={8} color="#228B22" />
          <Text style={styles.textOnline}>Online</Text>
        </View>
      </View>
      <Pressable style={styles.ellipsis}>
        <Ionicons name="ellipsis-vertical-sharp" size={24} color="#000000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contentProfile: {
    width: "100%",
    paddingHorizontal: 5,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  contentPhoto: {
    marginHorizontal: 5,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  contentUsername: {
    display: "flex",
    flexDirection: "column",
  },
  textUsername: {
    width: "100%",
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  contentOnline: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textOnline: {
    marginLeft: 5,
    fontSize: 10,
    color: "#000000",
  },
  ellipsis: {
    position: "absolute",
    right: 10,
  },
});

export default DisplayProfileMessage;
