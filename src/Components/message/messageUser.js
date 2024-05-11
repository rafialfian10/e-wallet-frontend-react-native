import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View, Text } from "react-native";

import DisplayMessage from "./displayMessage";
import Chat from "./chat";
import BtnContinueSendChat from "./btnContinueSendChat";
import RefreshPage from "../refreshPage";
import { SOCKET_SERVER } from "@env";
import { UserContext } from "../../Context/UserContext";

function MessageUser({ showChat, setShowChat }) {
  const [state, dispatch] = useContext(UserContext);

  const [adminsOnline, setAdminsOnline] = useState([]);
  const [adminsContact, setAdminsContact] = useState([]);
  const [adminContact, setAdminContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({
    contacts: null,
    message: "",
    files: [],
  });
  const [checklist, setChecklist] = useState({
    check: false,
    activeContactId: null,
  });

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

    // define corresponding socket listener
    socket.on("notification deleted", () => {
      if (adminContact) {
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
      const dataAdminsContact = data.map((item) => {
        const messages = [...item.senderMessage, ...item.recipientMessage]
          .filter(
            (msg) =>
              msg.recipientId === state?.user?.id ||
              msg.senderId === state?.user?.id
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const latestMessage = messages.length > 0 ? messages[0] : null;

        return {
          ...item,
          message: latestMessage
            ? latestMessage.message
            : "Click here to start message",
          createdAt: latestMessage ? latestMessage.createdAt : "",
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
    socket.emit("load messages", adminContact?.id);
    loadAdminsContact();
  };

  return !showChat ? (
    <View style={styles.subContainerMessage}>
      <RefreshPage pageStyle={""} onRefresh={handleRefresh}>
        <View>
          <Text style={styles.textLogo}>E-Wallet</Text>
          <DisplayMessage
            state={state}
            form={form}
            setForm={setForm}
            contacts={adminsContact}
            messages={messages}
            checklist={checklist}
            setChecklist={setChecklist}
            onClickContact={onClickAdminContact}
            setShowChat={setShowChat}
          />
        </View>
      </RefreshPage>
      {form?.files?.length > 0 ? (
        <BtnContinueSendChat
          form={form}
          setForm={setForm}
          setChecklist={setChecklist}
        />
      ) : null}
    </View>
  ) : (
    <Chat
      state={state}
      form={form}
      setForm={setForm}
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
    flex: 1,
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
