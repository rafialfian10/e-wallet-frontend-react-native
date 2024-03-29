import { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import DisplayProfileChat from "./displayProfileChat";
import BtnSendChat from "./btnSendChat";
import DisplayChat from "./displayChat";
import ModalSendChatFile from "./modalSendChatFile";

function Chat({
  state,
  usersOnline,
  userContact,
  adminsOnline,
  adminContact,
  messages,
  setMessages,
  setShowChat,
}) {
  const [form, setForm] = useState({
    message: "",
    files: [],
  });
  const [holdIndexes, setHoldIndexes] = useState([]);
  const [modalChatFile, setModalChatFile] = useState(false);

  const closeModalChatFile = () => {
    setModalChatFile(false);
  };

  useEffect(() => {
    if (form.files.length > 0) {
      setModalChatFile(true);
    } else {
      setModalChatFile(false);
    }
  }, [form.files]);

  const onSendMessage = (form) => {
    const dataFiles = form.files.map((file) => ({
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
      size: file.size,
    }));

    const data = {
      message: form.message,
      files: dataFiles,
      recipientId: userContact?.id || adminContact?.id,
    };

    // emit event for send message
    socket.emit("send message", data);
  };

  return (
    <>
      <View style={styles.containerChat}>
        <DisplayProfileChat
          usersOnline={usersOnline}
          userContact={userContact}
          adminsOnline={adminsOnline}
          adminContact={adminContact}
          setMessages={setMessages}
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
        <BtnSendChat
          form={form}
          setForm={setForm}
          userContact={userContact}
          adminContact={adminContact}
          onSendMessage={onSendMessage}
        />
      </View>
      {form.files.length !== 0 && (
        <ModalSendChatFile
          form={form}
          setForm={setForm}
          onSendMessage={onSendMessage}
          modalChatFile={modalChatFile}
          closeModalChatFile={closeModalChatFile}
        />
      )}
    </>
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
