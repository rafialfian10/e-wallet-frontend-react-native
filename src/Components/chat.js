import { StyleSheet, SafeAreaView, ScrollView } from "react-native";

import DisplayProfileChat from "./displayProfileChat";
import BtnSendChat from "./btnSendChat";
import DisplayChat from "./displayChat";

function Chat({ state, adminContact, messages,setShowChat }) {
  const onSendMessage = (form) => {
    const data = {
      message: form.message,
      file: form.file,
      recipientId: adminContact.id,
    };

    // emit event for send message
    socket.emit("send message", data);
  };

  return (
    <SafeAreaView style={styles.containerChat}>
      <DisplayProfileChat adminContact={adminContact} setShowChat={setShowChat} />
      <ScrollView>
        <DisplayChat
          state={state}
          adminContact={adminContact}
          messages={messages}
        />
      </ScrollView>
      <BtnSendChat onSendMessage={onSendMessage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerChat: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
});

export default Chat;
