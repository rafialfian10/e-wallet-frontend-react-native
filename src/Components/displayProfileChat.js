import { Ionicons, Fontisto } from "@expo/vector-icons";
import { StyleSheet, View, Text, Pressable, Image, TouchableOpacity } from "react-native";

import { PATH_FILE } from "@env";

function DisplayProfileChat({ adminContact, setShowChat }) {
  const handleHideChat = () => {
    setShowChat(false);
  };

  return (
    <View style={styles.contentProfileChat}>
      <TouchableOpacity onPress={handleHideChat}> 
        <Ionicons name="arrow-back-outline" size={24} color="#000000" />
      </TouchableOpacity>
      <Pressable style={styles.contentPhoto}>
        {adminContact?.photo && adminContact?.photo !== `${PATH_FILE}/static/photo/null` ? (
          <Image
            source={{ uri: adminContact?.photo }}
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
        <Text style={styles.textUsername}>{adminContact?.username}</Text>
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
  contentProfileChat: {
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

export default DisplayProfileChat;
