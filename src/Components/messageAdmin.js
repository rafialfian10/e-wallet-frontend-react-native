import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import DisplayMessage from "./displayMessage";
import Chat from "./chats";
import { SOCKET_URL } from "@env";
import { UserContext } from "../Context/UserContext";

function MessageAdmin({ showChat, setShowChat }) {
  const [state, dispatch] = useContext(UserContext);

  const [usersContact, setUsersContact] = useState([]);
  const [userContact, setUserContact] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io(SOCKET_URL, {
      auth: {
        token: AsyncStorage.getItem("token"),
      },
      query: {
        id: state.user.id,
      },
    });

    socket.on("connect", () => {
      loadUsersContact();
      loadMessages();
    });

    // define corresponding socket listener
    socket.on("new message", () => {
      console.log("contact", userContact);
      console.log("triggered", userContact?.id);
      socket.emit("load messages", userContact?.id);
    });

    // listen error sent from server
    socket.on("connect_error", (err) => {
      console.error(err.message); // not authorized
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const loadUsersContact = () => {
    socket.emit("load users contact");

    socket.on("users contact", (data) => {
      // filter just customers which have sent a message
      let dataUsersContact = data.filter(
        (item) =>
          item.role.id !== 1 &&
          item.role.id !== 2 &&
          (item.recipientMessage.length > 0 || item.senderMessage.length > 0)
      );

      // manipulate customers to add message property with the newest message
      dataUsersContact = dataUsersContact.map((item) => {
        const allMessages = [...item.senderMessage, ...item.recipientMessage];
        
        // sort by createAt
        allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        return {
          ...item,
          message:
            allMessages.length > 0
              ? allMessages[allMessages.length - 1].message
              : "Klik di sini untuk memulai pesan",
        };
      });
      setUsersContact(dataUsersContact);
    });
  };

  // used for active style when click contact
  const onClickUserContact = (data) => {
    setUserContact(data);

    // emit event load messages
    socket.emit("load messages", data.id);
  };

  const loadMessages = () => {
    // define listener on event "messages"
    socket.on("messages", (data) => {
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          senderId: item?.sender.id,
          message: item?.message,
          file: item?.file
        }));
        setMessages(dataMessages);
      }
      loadUsersContact();
    });
  };

  return !showChat ? (
    <ScrollView>
      <View style={styles.subContainerMessage}>
        <Text style={styles.textLogo}>E-Wallet</Text>
        <View style={styles.contactContainer}>
          <DisplayMessage
            usersContact={usersContact}
            setShowChat={setShowChat}
            onClickUserContact={onClickUserContact}
          />
        </View>
      </View>
    </ScrollView>
  ) : (
    <Chat
      state={state}
      userContact={userContact}
      messages={messages}
      setShowChat={setShowChat}
    />
  );
}

const styles = StyleSheet.create({
  subContainerMessage: {
    width: "100%",
  },
  textLogo: {
    padding: 10,
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    borderTopColor: "#F5F5F5",
    borderRightColor: "#F5F5F5",
    borderLeftColor: "#F5F5F5",
    borderBottomColor: "#808080",
    borderWidth: 1,
  },
});

export default MessageAdmin;
