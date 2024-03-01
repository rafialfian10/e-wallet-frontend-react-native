import { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import DisplayProfileChat from "./displayProfileChat";
import BtnSendChat from "./btnSendChat";
import DisplayChat from "./displayChat";

function Chat({ state, userContact, adminContact, messages, setShowChat, siofu }) {
  const [holdIndexes, setHoldIndexes] = useState([]);

  const onSendMessage = (form) => {
    const data = {
      message: form.message,
      file: form.file,
      recipientId: userContact?.id || adminContact?.id,
    };

    // emit event for send message
    socket.emit("send message", data);
  };

  return (
    <View style={styles.containerChat}>
      <DisplayProfileChat
        userContact={userContact}
        adminContact={adminContact}
        setShowChat={setShowChat}
        holdIndexes={holdIndexes}
        setHoldIndexes={setHoldIndexes}
      />
      <ScrollView>
        <DisplayChat
          state={state}
          userContact={userContact}
          adminContact={adminContact}
          messages={messages}
          holdIndexes={holdIndexes}
          setHoldIndexes={setHoldIndexes}
        />
      </ScrollView>
      <BtnSendChat onSendMessage={onSendMessage} />
    </View>
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
