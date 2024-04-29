import { useState, useEffect } from "react";
import moment from "moment";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

import { PATH_FILE } from "@env";

function DisplayMessage({
  adminsContact,
  usersContact,
  messages,
  notifications,
  setNotifications,
  setShowChat,
  onClickContact,
}) {
  const [allNotification, setAllNotification] = useState([]);

  const handleShowChat = (id) => {
    setShowChat(true);
  };

  // notification from admin for users
  useEffect(() => {
    const dataNotifications = [];

    adminsContact?.forEach((adminContact) => {
      adminContact?.senderMessage?.forEach((message) => {
        dataNotifications.push({
          id: message?.id,
          notification: message?.notification,
        });
      });
    });

    setAllNotification(dataNotifications);
  }, [adminsContact, messages]);

  // notification from users for admin
  useEffect(() => {
    const dataNotifications = [];

    usersContact?.forEach((userContact) => {
      userContact?.senderMessage?.forEach((message) => {
        dataNotifications.push({
          id: message?.id,
          notification: message?.notification,
        });
      });
    });

    setAllNotification(dataNotifications);
  }, [usersContact, messages]);

  return (
    <View style={styles.contentMessage}>
      {(usersContact?.length > 0 || usersContact !== undefined) &&
        usersContact?.map((userContact, i) => {
          const notificationCount = allNotification?.filter(
            (notification) => notification?.notification === userContact?.id
          ).length;

          return (
            <TouchableOpacity
              key={i}
              style={styles.contactContainer}
              onPress={() => {
                handleShowChat(userContact?.id);
                onClickContact(userContact);
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
                    source={require("../../../assets/default-photo.png")}
                    style={styles.photo}
                    alt="default-photo"
                  />
                )}
              </View>
              <View style={styles.contentDataUser}>
                <View style={styles.contentUsernameDate}>
                  <Text style={styles.username}>{userContact?.username}</Text>
                  <Text style={styles.date}>
                    {userContact.createdAt
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
        })}
      {(adminsContact?.length > 0 || adminsContact !== undefined) &&
        adminsContact?.map((adminContact, i) => {
          const notificationCount = allNotification?.filter(
            (notification) => notification?.notification === adminContact?.id
          ).length;

          return (
            <TouchableOpacity
              key={i}
              style={styles.contactContainer}
              onPress={() => {
                handleShowChat(adminContact?.id);
                onClickContact(adminContact);
              }}
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
                    source={require("../../../assets/default-photo.png")}
                    style={styles.photo}
                    alt="default-photo"
                  />
                )}
              </View>
              <View style={styles.contentDataUser}>
                <View style={styles.contentUsernameDate}>
                  <Text style={styles.username}>{adminContact?.username}</Text>
                  <Text style={styles.date}>
                    {adminContact.createdAt
                      ? moment(adminContact?.createdAt).format("DD/MM/YY")
                      : ""}
                  </Text>
                </View>
                <View style={styles.contentMessageNotification}>
                  <Text style={styles.message}>{adminContact?.message}</Text>
                  {notificationCount > 0 && (
                    <Text style={styles.notification}>{notificationCount}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    fontSize: 11,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 50,
    color: "#FFFFFF",
    backgroundColor: "lightgreen",
  },
});

export default DisplayMessage;
