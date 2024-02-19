import { useContext } from "react";
import { io } from "socket.io-client";
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from "react-native";

import DisplayProfileMessage from "../Components/displayProfileMessage";
import BtnSendMessage from "../Components/btnSendMessage";
import { GetUser } from "../Components/Common/Hooks/getUser";
import { UserContext } from "../Context/UserContext";

function Message() {
  const [state, dispatch] = useContext(UserContext);
  const userRole = state?.user?.role?.id;
  
  const { user, refetchUser } = GetUser();

  return (
    <SafeAreaView style={styles.containerMessage}>
      <View style={styles.subContainerMessage}>
        <DisplayProfileMessage user={user} />
      </View>
      <ScrollView>
        <View style={styles.contentMessage}>
          {userRole === 3 ? (
            <View style={styles.subContentMessageUser}>
              <Text style={styles.textMessage}>saya user, halo admin</Text>
            </View>
          ) : (
            <View style={styles.subContentMessageAdmin}>
              <Text style={styles.textMessage}>saya admin, halo user</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <BtnSendMessage state={state} refetchUser={refetchUser} />
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
  contentMessage: {
    width: "100%",
    padding: 10,
  },
  subContentMessageUser: {
    marginBottom: 10,
    marginLeft: 20,
    padding: 10,
    alignSelf: "flex-end",
    borderRadius: 10,
    backgroundColor: "#B0FFC9",
  },
  subContentMessageAdmin: {
    marginBottom: 10,
    marginRight: 20,
    padding: 10,
    alignSelf: "flex-start",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  textMessage: {
    textAlign: "left",
    fontSize: 14,
    color: "#000000",
  },
});

export default Message;
