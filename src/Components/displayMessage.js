import { useState, useEffect } from "react";
import moment from "moment";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

import { PATH_FILE } from "@env";

function DisplayMessage({
  adminContact,
  usersContact,
  messages,
  loadMessages,
  setShowChat,
  onClickUserContact,
  notifications,
  setNotifications,
}) {
  const [allNotification, setAllNotification] = useState([]);

  const lastMessage = messages[messages.length - 1];

  const handleShowChat = (id) => {
    setShowChat(true);

    const filteredNotifications = allNotification?.filter(
      (notification) => notification?.notification === id
    );
    if (filteredNotifications.length > 0) {
      socket.emit("delete notification", filteredNotifications);
    }

    if (typeof loadMessages === "function") {
      loadMessages(adminContact?.id);
      loadMessages();
    }

    // if (typeof setNotifications === "function") {
    //   const updatedNotifications = notifications?.filter(
    //     (notification) => notification.senderId !== userContactId
    //   );

    //   setNotifications(updatedNotifications);
    // }
  };

  // notification from admin
  useEffect(() => {
    const dataNotifications = messages
      ?.map((message) => ({
        id: message?.id,
        notification: message?.notification,
      }))
      .filter(
        (notification) => notification?.notification === adminContact?.id
      );

    setAllNotification(dataNotifications);
  }, [messages, adminContact]);

  // notification from users
  useEffect(() => {
    const newData = [];

    usersContact?.map((userContact) => {
      userContact?.senderMessage?.map((data) => {
        newData.push({ id: data.id, notification: data.notification });
      });
    });

    setAllNotification(newData);
  }, [usersContact]);

  return (
    <View style={styles.contentMessage}>
      {usersContact?.length > 0 ? (
        usersContact?.map((userContact, i) => {
          const notificationCount = allNotification?.filter(
            (notification) => notification?.notification === userContact?.id
          ).length;
          // const notificationCount = notifications.filter(
          //   (notification) => notification.senderId === userContact.id
          // ).length;
          return (
            <TouchableOpacity
              key={i}
              style={styles.contactContainer}
              onPress={() => {
                handleShowChat(userContact?.id);
                onClickUserContact(userContact);
              }}
            >
              <View style={styles.contentPhoto}>
                {userContact?.photo &&
                userContact?.photo !== `${PATH_FILE}/static/photo/null` ? (
                  <Image
                    source={{ uri: userContact?.photo }}
                    style={styles.photo}
                    alt="photo"
                  />
                ) : (
                  <Image
                    source={require("../../assets/default-photo.png")}
                    style={styles.photo}
                    alt="default-photo"
                  />
                )}
              </View>
              <View style={styles.contentDataUser}>
                <View style={styles.contentUsernameDate}>
                  <Text style={styles.username}>{userContact?.username}</Text>
                  <Text style={styles.date}>
                    {userContact
                      ? moment(userContact?.createdAt).format("DD/MM/YY")
                      : ""}
                  </Text>
                </View>
                <View style={styles.contentMessageNotification}>
                  <Text style={styles.message}>{userContact?.message}</Text>
                  {notificationCount > 0 && (
                    <Text style={styles.notification}>{notificationCount}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <TouchableOpacity
          style={styles.contactContainer}
          onPress={() => handleShowChat(adminContact?.id)}
        >
          <View style={styles.contentPhoto}>
            {adminContact?.photo &&
            adminContact?.photo !== `${PATH_FILE}/static/photo/null` ? (
              <Image
                source={{ uri: adminContact?.photo }}
                style={styles.photo}
                alt="photo"
              />
            ) : (
              <Image
                source={require("../../assets/default-photo.png")}
                style={styles.photo}
                alt="default-photo"
              />
            )}
          </View>
          <View style={styles.contentDataUser}>
            <View style={styles.contentUsernameDate}>
              <Text style={styles.username}>{adminContact?.username}</Text>
              <Text style={styles.date}>
                {lastMessage
                  ? moment(lastMessage?.createdAt).format("DD/MM/YY")
                  : ""}
              </Text>
            </View>
            <View style={styles.contentMessageNotification}>
              <Text style={styles.message}>{adminContact?.message}</Text>
              {allNotification.length > 0 && (
                <Text style={styles.notification}>
                  {allNotification.length}
                </Text>
              )}
              {/* {notifications.length > 0 && (
                <Text style={styles.notification}>{notifications.length}</Text>
              )} */}
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentMessage: {
    width: "100%",
    padding: 10,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  contentPhoto: {
    width: "15%",
    marginHorizontal: 5,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  contentDataUser: {
    width: "85%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  contentUsernameDate: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    textAlignVertical: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  date: {
    textAlignVertical: "center",
    fontSize: 11,
    color: "#808080",
  },
  contentMessageNotification: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  message: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#808080",
  },
  notification: {
    width: 20,
    height: 20,
    fontSize: 12,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 50,
    color: "#FFFFFF",
    backgroundColor: "lightgreen",
  },
});

export default DisplayMessage;
