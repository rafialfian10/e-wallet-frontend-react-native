import { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

import BtnDownloadFile from "./btnDownloadFile";

function DisplayChat({
  state,
  userContact,
  adminContact,
  messages,
  holdIndexes,
  setHoldIndexes,
}) {
  const handleHold = (index) => {
    if (holdIndexes.includes(index)) {
      setHoldIndexes(holdIndexes.filter((i) => i !== index));
    } else {
      setHoldIndexes([...holdIndexes, index]);
    }
  };

  const handleClick = (index) => {
    setHoldIndexes(holdIndexes.filter((i) => i !== index));
  };

  const renderMessage = (item, i) => (
    <TouchableOpacity
      key={i}
      style={[
        styles.subContentChat,
        {
          alignSelf:
            item?.senderId === state?.user?.id ? "flex-end" : "flex-start",
          backgroundColor:
            item?.senderId === state?.user?.id ? "#B0FFC9" : "#FFFFFF",
          marginLeft: item?.senderId === state?.user?.id ? 20 : 0,
          marginRight: item?.senderId === state?.user?.id ? 0 : 20,
          opacity: holdIndexes.includes(item?.id) ? 0.5 : 1,
        },
      ]}
      onLongPress={() => handleHold(item?.id)}
      onPress={() => handleClick(item?.id)}
    >
      {item?.files?.map((file, j) => (
        <View key={j} style={styles.contentDownloadFile}>
          <BtnDownloadFile file={file} />
          <Text style={styles.textFile}>
            {file?.fileName?.length > 30
              ? file?.fileName.slice(0, 30) + "..."
              : file?.fileName}
          </Text>
        </View>
      ))}
      {item?.message !== "" && (
        <View style={styles.contentMessage}>
          <Text style={styles.textMessage}>{item?.message}</Text>
          {(item?.recipientId === adminContact?.id ||
            item?.recipientId === userContact?.id) && (
            <View style={styles.contentDateIcon}>
              <Text style={styles.textDate}>
                {moment(item?.createdAt).format("HH:mm")}
              </Text>
              <Ionicons
                id="icon"
                name={
                  item?.notification !== null
                    ? "checkmark-outline"
                    : "checkmark-done-outline"
                }
                size={15}
                color={item.notification !== null ? "#000000" : "#3773DB"}
                style={styles.checklistIcon}
              />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  useEffect(() => {
    const filteredNotifications = messages?.filter(
      (message) =>
        message?.notification === adminContact?.id ||
        message?.notification === userContact?.id
    );

    if (filteredNotifications.length > 0) {
      socket.emit("delete notification", filteredNotifications);
    }
  });

  return (
    <View style={styles.contentChat}>
      {userContact || adminContact ? (
        messages?.map((item, i) => {
          // displays the date only on the first message that has the same date
          if (
            i === 0 ||
            moment(messages[i - 1]?.createdAt).format("D MMMM YYYY") !==
              moment(item?.createdAt).format("D MMMM YYYY")
          ) {
            return (
              <View key={i}>
                <View style={styles.contentLastDate}>
                  <Text style={styles.textLastDate}>
                    {moment(item?.createdAt).isSame(moment(), "day")
                      ? "Hari ini"
                      : moment(item?.createdAt).format("D MMMM YYYY")}
                  </Text>
                </View>
                {renderMessage(item, i)}
              </View>
            );
          } else {
            return renderMessage(item, i);
          }
        })
      ) : (
        <View style={styles.contentNoMessage}>
          <Text style={styles.textNoMessage}>No Message</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentChat: {
    width: "100%",
    marginTop: 10,
    marginBottom: 60,
    padding: 10,
  },
  contentLastDate: {
    width: "100%",
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textLastDate: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  subContentChat: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  contentDownloadFile: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textFile: {
    fontSize: 14,
    color: "#000000",
  },
  contentMessage: {
    flexDirection: "column",
    alignItems: "center",
  },
  textMessage: {
    width: "100%",
    marginBottom: 5,
    textAlign: "left",
    textAlignVertical: "center",
    fontSize: 14,
    color: "#000000",
    borderColor: "black",
  },
  contentDateIcon: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  textDate: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 10,
  },
  checklistIcon: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  contentNoMessage: {
    width: "100%",
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textNoMessage: {
    color: "#808080",
  },
});

export default DisplayChat;
