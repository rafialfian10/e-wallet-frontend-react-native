import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, SafeAreaView, ScrollView, View, Text, TouchableOpacity } from "react-native";

import DisplayMessage from "../Components/displayMessage";
import Chat from "../Components/chat";
import { SOCKET_URL } from "@env";
import { UserContext } from "../Context/UserContext";

function Message({ navigation }) {
  const [state, dispatch] = useContext(UserContext);

  const [adminContact, setAdminContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);

  console.log(showChat);

  const handleShowChat = () => {
    setShowChat(true);
  };

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
      loadAdminContact();
      loadMessages();
    });

    // define corresponding socket listener
    socket.on("new message", () => {
      console.log("contact", adminContact);
      console.log("triggered", adminContact?.id);
      socket.emit("load messages", adminContact?.id);
    });

    // listen error sent from server
    socket.on("connect_error", (err) => {
      console.error(err.message); // not authorized
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

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
          senderId: item?.sender.id,
          message: item?.message,
          file: item?.file,
        }));
        setMessages(dataMessages);
      }
    });
  };

  useEffect(() => {
    if (adminContact) {
      loadMessages(adminContact?.id);
    }
  }, [adminContact?.id]);

  return (
    <SafeAreaView style={styles.containerMessage}>
      <ScrollView>
        {!showChat ? (
          <View style={styles.subContainerMessage}>
            <Text style={styles.textLogo}>E-Wallet</Text>
            <TouchableOpacity
              style={styles.contactContainer}
              onPress={handleShowChat}
            >
              <DisplayMessage
                navigation={navigation}
                adminContact={adminContact}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Chat
            state={state}
            adminContact={adminContact}
            messages={messages}
            setShowChat={setShowChat}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerMessage: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
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

export default Message;
