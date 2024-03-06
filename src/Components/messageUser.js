import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import DisplayMessage from "./displayMessage";
import Chat from "./chats";
import { SOCKET_SERVER } from "@env";
import { UserContext } from "../Context/UserContext";

function MessageUser({ showChat, setShowChat }) {
  const [state, dispatch] = useContext(UserContext);

  const [adminOnline, setAdminOnline] = useState(false);
  const [adminContact, setAdminContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket = io(SOCKET_SERVER, {
      auth: {
        token: AsyncStorage.getItem("token"),
      },
      query: {
        id: state.user.id,
      },
    });

    // define corresponding socket listener
    socket.on("new message", () => {
      // console.log("contact", adminContact);
      // console.log("triggered", adminContact?.id);
      socket.emit("load messages", adminContact?.id);
    });

    socket.on("connect", () => {
      loadAdminContact();
      loadMessages();
    });

    socket.on("notification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    // listen error sent from server
    socket.on("connect_error", (err) => {
      console.error(err.message); // not authorized
    });

    return () => {
      socket.disconnect();
    };
  }, [messages, adminContact?.id]);

  const loadAdminContact = () => {
    // emit corresponding event to load admin contact
    socket.emit("load admin contact");

    // listen event to get admin contact
    socket.on("admin contact", async (data) => {
      // manipulate data to add message property with the newest message
      const dataAdminContact = {
        ...data,
        message:
          messages.length > 0
            ? messages[messages.length - 1].message
            : "Click here to start message",
      };
      setAdminContact(dataAdminContact);
    });
  };

  const loadMessages = (id) => {
    // emit event load messages
    socket.emit("load messages", id);

    // define listener on event "messages"
    socket.on("messages", async (data) => {
      if (data?.length > 0) {
        const dataMessages = data?.map((item) => ({
          id: item?.id,
          senderId: item?.sender.id,
          message: item?.message,
          files: item?.files,
          createdAt: item?.createdAt,
        }));
        setMessages(dataMessages);
      }
    });
  };

  useEffect(() => {
    socket.on("adminOnline", (adminId) => {
      if (adminId === adminContact?.id) {
        setAdminOnline(true);
      }
    });

    socket.on("adminOffline", (adminId) => {
      if (adminId === adminContact?.id) {
        setAdminOnline(false);
      }
    });
  }, [adminContact]);

  useEffect(() => {
    if (adminContact) {
      loadMessages(adminContact?.id);
    }
  }, [adminContact?.id]);

  useEffect(() => {
    socket.on("messages deleted", (deletedIds) => {
      // Filter out the deleted messages from the current messages state
      const updatedMessages = messages.filter(
        (message) => !deletedIds.includes(message.id)
      );
      setMessages(updatedMessages);
    });

    return () => {
      socket.off("messages deleted");
    };
  }, [messages]);

  return !showChat ? (
    <ScrollView>
      <View style={styles.subContainerMessage}>
        <Text style={styles.textLogo}>E-Wallet</Text>
        <View style={styles.contactContainer}>
          <DisplayMessage
            adminContact={adminContact}
            setShowChat={setShowChat}
            messages={messages}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </View>
      </View>
    </ScrollView>
  ) : (
    <Chat
      state={state}
      adminOnline={adminOnline}
      adminContact={adminContact}
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

export default MessageUser;
