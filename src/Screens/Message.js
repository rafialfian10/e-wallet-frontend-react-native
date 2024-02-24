import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from "react-native";

import DisplayMessage from "../Components/displayMessage";
import Chat from "../Components/chats";
import { SOCKET_URL } from "@env";
import { UserContext } from "../Context/UserContext";
import MessageUser from "../Components/messageUser";
import MessageAdmin from "../Components/messageAdmin";

function Message({ navigation }) {
  const [state, dispatch] = useContext(UserContext);

  const [showChat, setShowChat] = useState(false);

  return (
    <SafeAreaView style={styles.containerMessage}>
      {state?.user?.role?.id === 3 ? (
        <MessageUser showChat={showChat} setShowChat={setShowChat} />
      ) : (
        <MessageAdmin showChat={showChat} setShowChat={setShowChat} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerMessage: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
});

export default Message;
