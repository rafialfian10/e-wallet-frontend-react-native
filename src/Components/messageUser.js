import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View } from "react-native";

import DisplayMessage from "./displayMessage";
import Chat from "./chats";
import RefreshPage from "./refreshPage";
import { SOCKET_SERVER } from "@env";
import { UserContext } from "../Context/UserContext";

function MessageUser({ showChat, setShowChat }) {
  const [state, dispatch] = useContext(UserContext);

  const [adminsOnline, setAdminsOnline] = useState([]);
  const [adminsContact, setAdminsContact] = useState([]);
  const [adminContact, setAdminContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket = io("http://192.168.43.232:5000", {
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

    // define corresponding socket listener
    socket.on("notification deleted", () => {
      if(adminContact) {
        socket.emit("load messages", adminContact?.id);
      }
    });

    socket.on("notification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    socket.on("connect", () => {
      loadAdminsContact();
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

  const loadAdminsContact = () => {
    socket.emit("load admins contact");

    socket.on("admins contact", (data) => {
      // filter just customers which have sent a message
      let dataAdminsContact = data?.filter(
        (item) =>
          item?.recipientMessage.length >= 0 || item?.senderMessage.length >= 0
      );

      // manipulate customers to add message property with the newest message
      dataAdminsContact = dataAdminsContact?.map((item) => {
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
      setAdminsContact(dataAdminsContact);
    });
  };

  const onClickAdminContact = (data) => {
    setAdminContact(data);

    // emit event load messages
    socket.emit("load messages", data?.id);
  };

  const loadMessages = () => {
    // define listener on event "messages"
    socket.on("messages", (data) => {
      if (data?.length >= 0) {
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
      loadAdminsContact();
    });
  };

  useEffect(() => {
    socket.on("admin online", (adminId) => {
      setAdminsOnline((prevAdminOnline) => {
        const newAdminOnline = [...prevAdminOnline];

        if (!newAdminOnline.includes(adminId)) {
          newAdminOnline.push(adminId);
        }
        return newAdminOnline;
      });
    });

    socket.on("admin offline", (adminId) => {
      setAdminsOnline((prevAdminOnline) => {
        const newAdminOnline = prevAdminOnline.filter(
          (admin) => admin !== adminId
        );
        return newAdminOnline;
      });
    });
  }, [adminsContact]);

  useEffect(() => {
    socket.on("messages deleted", (deletedIds) => {
      const updatedMessages = messages?.filter(
        (message) => !deletedIds.includes(message?.id)
      );

      setMessages(updatedMessages);
    });

    return () => {
      socket.off("messages deleted");
    };
  }, [messages]);

  const handleRefresh = () => {
    socket.emit("load messages", adminContact?.id)
    loadAdminsContact();
  };

  return !showChat ? (
    <RefreshPage pageStyle={""} onRefresh={handleRefresh}>
      <View style={styles.subContainerMessage}>
        <Text style={styles.textLogo}>E-Wallet</Text>
        <View style={styles.contactContainer}>
          <DisplayMessage
            adminsContact={adminsContact}
            messages={messages}
            notifications={notifications}
            setNotifications={setNotifications}
            onClickContact={onClickAdminContact}
            setShowChat={setShowChat}
          />
        </View>
      </View>
    </RefreshPage>
  ) : (
      <Chat
        state={state}
        adminsOnline={adminsOnline}
        adminContact={adminContact}
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

export default MessageUser;
