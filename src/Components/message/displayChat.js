import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

import BtnDownloadFile from "./btnDownloadFile";
import BtnPlayAudio from "./btnPlayAudio";
import BtnPlayVideo from "./btnPlayVideo";
import BtnContinueChat from "./btnContinueChat";
import PreviewImage from "./previewImage";

function DisplayChat({
  state,
  form,
  setForm,
  userContact,
  adminContact,
  messages,
  holdIndexes,
  setHoldIndexes,
  setShowChat,
}) {
  const handleHold = (index) => {
    if (holdIndexes.length === 0) {
      setHoldIndexes([index]);
    } else if (!holdIndexes.includes(index)) {
      setHoldIndexes([...holdIndexes, index]);
    }
  };

  const handleClick = (index) => {
    if (holdIndexes.length > 0) {
      if (holdIndexes.includes(index)) {
        setHoldIndexes(holdIndexes.filter((i) => i !== index));
      } else {
        setHoldIndexes([...holdIndexes, index]);
      }
    }
  };

  const renderMessage = (item, i) => (
    <View key={i} style={styles.subContentChat}>
      {item?.files?.map((file, index) => (
        <View
          key={index}
          style={[
            styles.contentContinueChat,
            {
              flexDirection:
                item?.senderId === state?.user?.id ? "row" : "row-reverse",
              alignSelf:
                item?.senderId === state?.user?.id ? "flex-end" : "flex-start",
              opacity: holdIndexes.includes(item?.id) ? 0.5 : 1,
            },
          ]}
        >
          {file?.extension === ".jpg" || file?.extension === ".mp4" ? (
            <BtnContinueChat
              file={file}
              form={form}
              setForm={setForm}
              setShowChat={setShowChat}
            />
          ) : null}
          <View
            style={[
              styles.itemChat,
              {
                backgroundColor:
                  item?.senderId === state?.user?.id ? "#B0FFC9" : "#FFFFFF",
              },
            ]}
          >
            <Pressable
              style={{ position: "relative" }}
              onLongPress={() => handleHold(item?.id)}
              onPress={() => handleClick(item?.id)}
            >
              <View style={styles.contentShowFile}>
                {file?.extension !== null ? (
                  file.extension === ".jpg" ? (
                    <PreviewImage file={file} />
                  ) : file.extension === ".mp4" ? (
                    <BtnPlayVideo file={file} />
                  ) : (
                    <BtnPlayAudio file={file} index={index} />
                  )
                ) : (
                  <View style={styles.contentDownloadFile}>
                    <BtnDownloadFile file={file} />
                    <Text style={styles.textFile}>
                      {file?.fileName?.length > 30
                        ? file?.fileName.slice(0, 30) + "..."
                        : file?.fileName}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.contentDateIconFile,
                  {
                    bottom:
                      file?.extension === ".jpg" || file?.extension === ".mp4"
                        ? 5
                        : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.textDate,
                    {
                      color:
                        file?.extension === ".jpg" || file?.extension === ".mp4"
                          ? "#FFFFFF"
                          : "#000000",
                    },
                  ]}
                >
                  {moment(item?.createdAt).format("HH:mm")}
                </Text>
                {(item?.recipientId === adminContact?.id ||
                  item?.recipientId === userContact?.id) && (
                  <Ionicons
                    id="icon"
                    name={
                      item?.notification !== null
                        ? "checkmark-outline"
                        : "checkmark-done-outline"
                    }
                    size={15}
                    color={
                      item.notification !== null
                        ? file?.extension === ".jpg" ||
                          file?.extension === ".mp4"
                          ? "#FFFFFF"
                          : "#000000"
                        : "#3773DB"
                    }
                    style={styles.checklistIcon}
                  />
                )}
              </View>
            </Pressable>
          </View>
        </View>
      ))}
      {item?.files[0]?.extension !== ".m4a" ? (
        <Pressable
          style={[
            styles.contentMessage,
            {
              alignSelf:
                item?.senderId === state?.user?.id ? "flex-end" : "flex-start",
              backgroundColor:
                item?.senderId === state?.user?.id ? "#B0FFC9" : "#FFFFFF",
              opacity: holdIndexes.includes(item?.id) ? 0.5 : 1,
            },
          ]}
          onLongPress={() => handleHold(item?.id)}
          onPress={() => handleClick(item?.id)}
        >
          {item?.message !== "" && (
            <Text style={styles.textMessage}>{item?.message}</Text>
          )}
          <View style={styles.contentDateIcon}>
            <Text style={styles.textDate}>
              {moment(item?.createdAt).format("HH:mm")}
            </Text>
            {item?.recipientId === adminContact?.id ||
            item?.recipientId === userContact?.id ? (
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
            ) : null}
          </View>
        </Pressable>
      ) : null}
    </View>
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
    <TouchableWithoutFeedback onPress={() => setHoldIndexes([])}>
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
    </TouchableWithoutFeedback>
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
  },
  contentContinueChat: {
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
  },
  itemChat: {
    padding: 5,
    borderRadius: 10,
  },
  contentShowFile: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  contentDownloadFile: {
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textFile: {
    fontSize: 14,
    color: "#000000",
  },
  contentMessage: {
    maxWidth: "80%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 10,
  },
  textMessage: {
    textAlign: "left",
    textAlignVertical: "center",
    fontSize: 14,
    color: "#000000",
  },
  contentDateIcon: {
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  contentDateIconFile: {
    position: "absolute",
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  textDate: {
    marginRight: 3,
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
