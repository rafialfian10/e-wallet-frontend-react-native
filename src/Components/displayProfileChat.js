import { Ionicons, FontAwesome, Fontisto } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import { PATH_FILE } from "@env";

function DisplayProfileChat({
  usersOnline,
  userContact,
  adminsOnline,
  adminContact,
  setShowChat,
  setMessages,
  holdIndexes,
  setHoldIndexes,
}) {
  const isAdminOnline = adminsOnline && adminsOnline?.includes(adminContact?.id);
  const isUserOnline = usersOnline && usersOnline.includes(userContact?.id);
  
  const handleHideChat = () => {
    setShowChat(false);
    if (typeof setMessages === "function") {
      setMessages([]);
    }
  };

  const onDeleteMessage = () => {
    Alert.alert(
      "",
      `delete ${holdIndexes.length} message?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            // emit event for delete messages
            socket.emit("delete messages", holdIndexes);
            setHoldIndexes([]);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.contentProfileChat}>
      <TouchableOpacity onPress={handleHideChat}>
        <Ionicons name="arrow-back-outline" size={24} color="#000000" />
      </TouchableOpacity>
      <Pressable style={styles.contentPhoto}>
        {(userContact?.photo &&
          userContact?.photo !== `${PATH_FILE}/static/photo/null`) ||
        (adminContact?.photo &&
          adminContact?.photo !== `${PATH_FILE}/static/photo/null`) ? (
          <Image
            source={{ uri: userContact?.photo || adminContact?.photo }}
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
        <Text style={styles.textUsername}>
          {userContact?.username || adminContact?.username}
        </Text>
        <View style={styles.contentOnline}>
          <Fontisto
            name="ellipse"
            size={8}
            color={isUserOnline || isAdminOnline ? "#228B22" : "#D9646D"}
          />
          <Text style={styles.textOnline}>
            {isUserOnline || isAdminOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </View>
      <Pressable style={styles.contanetTrashEllipsis}>
        {holdIndexes.length > 0 && (
          <TouchableOpacity onPress={onDeleteMessage}>
            <FontAwesome name="trash-o" size={24} color="black" />
          </TouchableOpacity>
        )}
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical-sharp" size={24} color="#000000" />
        </TouchableOpacity>
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
  contanetTrashEllipsis: {
    position: "absolute",
    right: 10,
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
});

export default DisplayProfileChat;
