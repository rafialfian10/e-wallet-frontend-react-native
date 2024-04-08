import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View } from "react-native";

import DisplayMessage from "./displayMessage";
import Chat from "./chats";
import { SOCKET_SERVER } from "@env";
import { UserContext } from "../Context/UserContext";
import RefreshPage from "./refreshPage";

function MessageAdmin({ showChat, setShowChat }) {
  const [state, dispatch] = useContext(UserContext);

  const [usersOnline, setUsersOnline] = useState([]);
  const [usersContact, setUsersContact] = useState([]);
  const [userContact, setUserContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket = io("http://192.168.89.106:5000", {
      auth: {
        token: AsyncStorage.getItem("token"),
      },
      query: {
        id: state.user.id,
      },
    });

    // define corresponding socket listener
    socket.on("new message", () => {
      // console.log("contact", userContact);
      // console.log("triggered", userContact?.id);
      socket.emit("load messages", userContact?.id);
    });

    socket.on("notification deleted", () => {
      if(userContact) {
        socket.emit("load messages", userContact?.id);
      }
    });

    socket.on("notification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    socket.on("connect", () => {
      loadUsersContact();
      loadMessages();
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
      let dataUsersContact = data?.filter(
        (item) =>
          item?.role.id !== 1 &&
          item?.role.id !== 2 &&
          (item?.recipientMessage.length > 0 || item?.senderMessage.length > 0)
      );

      // manipulate customers to add message property with the newest message
      dataUsersContact = dataUsersContact.map((item) => {
        const allMessages = [...item.senderMessage, ...item.recipientMessage];

        // sort by createAt
        allMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        return {
          ...item,
          message:
            allMessages.length > 0
              ? allMessages[allMessages.length - 1].message
              : "Click here to start message",
          createdAt:
            allMessages.length > 0
              ? allMessages[allMessages.length - 1].createdAt
              : "",
        };
      });
      setUsersContact(dataUsersContact);
    });
  };

  const onClickUserContact = (data) => {
    setUserContact(data);

    // emit event load messages
    socket.emit("load messages", data?.id);
  };

  const loadMessages = () => {
    // define listener on event "messages"
    socket.on("messages", (data) => {
      if (data.length >= 0) {
        const dataMessages = data?.map((item) => ({
          id: item?.id,
          senderId: item?.sender.id,
          recipientId: item?.recipient.id,
          message: item?.message,
          notification: item?.notification,
          files: item?.files,
          createdAt: item?.createdAt,
        }));
        setMessages(dataMessages);
      }
      loadUsersContact();
    });
  };

  useEffect(() => {
    socket.on("user online", (userId) => {
      setUsersOnline((prevUserOnline) => {
        const newUserOnline = [...prevUserOnline];

        if (!newUserOnline.includes(userId)) {
          newUserOnline.push(userId);
        }
        return newUserOnline;
      });
    });

    socket.on("user offline", (userId) => {
      setUsersOnline((prevUserOnline) => {
        const newUserOnline = prevUserOnline.filter((user) => user !== userId);
        return newUserOnline;
      });
    });
  }, [usersContact]);

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

  const handleRefresh = () => {
    socket.emit("load messages", userContact?.id)
    loadUsersContact();
  };

  return !showChat ? (
    <RefreshPage pageStyle={""} onRefresh={handleRefresh}>
      <View style={styles.subContainerMessage}>
        <Text style={styles.textLogo}>E-Wallet</Text>
        <View style={styles.contactContainer}>
          <DisplayMessage
            usersContact={usersContact}
            messages={messages}
            notifications={notifications}
            setNotifications={setNotifications}
            onClickContact={onClickUserContact}
            setShowChat={setShowChat}
          />
        </View>
      </View>
    </RefreshPage>
  ) : (
    <Chat
      state={state}
      usersOnline={usersOnline}
      userContact={userContact}
      messages={messages}
      setMessages={setMessages}
      setShowChat={setShowChat}
      handleRefresh={handleRefresh}
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
