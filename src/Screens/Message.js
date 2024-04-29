import { useState, useContext } from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import { UserContext } from "../Context/UserContext";
import MessageUser from "../Components/message/messageUser";
import MessageAdmin from "../Components/message/messageAdmin";

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
    backgroundColor: "#FFFFFF",
  },
});

export default Message;
