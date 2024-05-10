import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

function DisplayMessage({
  state,
  form,
  setForm,
  contacts,
  messages,
  checklist,
  setChecklist,
  setShowChat,
  onClickContact,
}) {
  const [allNotification, setAllNotification] = useState([]);

  const handleShowChat = (dataContact) => {
    if (form?.files?.length > 0) {
      setChecklist((prevChecklist) => ({
        check:
          !prevChecklist.check ||
          prevChecklist.activeContactId !== dataContact?.id,
        activeContactId:
          prevChecklist.activeContactId !== dataContact?.id
            ? dataContact?.id
            : null,
      }));

      setForm((prevForm) => ({
        ...prevForm,
        contacts: prevForm.contacts !== dataContact ? dataContact : null,
      }));
    } else {
      setShowChat(true);
    }
  };

  // notification from admin and users
  useEffect(() => {
    const dataNotifications = [];

    contacts?.forEach((contact) => {
      contact?.senderMessage?.forEach((message) => {
          dataNotifications.push({
            id: message?.id,
            notification: message?.notification,
            recipientId: message?.recipientId,
          });
      });
    });

    setAllNotification(dataNotifications);
  }, [contacts, messages]);

  return (
    <View style={styles.contentMessage}>
      {(contacts?.length > 0 || contacts !== undefined) &&
        contacts?.map((contact, i) => {
          const notificationCountAdmin = allNotification?.filter(
            (notification) => notification?.notification === contact?.id
          ).length;

          const notificationCountUser = allNotification?.filter(
            (notification) => notification?.notification === contact?.id && notification?.recipientId === state?.user?.id
          ).length;

          return (
            <TouchableOpacity
              key={i}
              style={styles.contactContainer}
              onPress={() => {
                handleShowChat(contact);
                onClickContact(contact);
              }}
            >
              <View style={styles.contentPhoto}>
                <Image
                  source={
                    contact?.photo
                      ? { uri: contact.photo }
                      : require("../../../assets/default-photo.png")
                  }
                  style={styles.photo}
                  alt={contact?.photo ? "photo" : "default-photo"}
                />
                {checklist?.check &&
                  contact?.id === checklist?.activeContactId && (
                    <AntDesign
                      name="checkcircle"
                      size={20}
                      color="#38B03E"
                      style={styles.checklistIcon}
                    />
                  )}
              </View>
              <View style={styles.contentDataUser}>
                <View style={styles.contentUsernameDate}>
                  <Text style={styles.username}>{contact?.username}</Text>
                  <Text style={styles.date}>
                    {contact.createdAt
                      ? moment(contact?.createdAt).format("DD/MM/YY")
                      : ""}
                  </Text>
                </View>
                <View style={styles.contentMessageNotification}>
                  <Text style={styles.message}>{contact?.message}</Text>
                  {notificationCountAdmin > 0 && state?.user?.role?.id === 2 && (
                    <Text style={styles.notification}>{notificationCountAdmin}</Text>
                  )}
                   {notificationCountUser > 0 && state?.user?.role?.id === 3 && (
                    <Text style={styles.notification}>{notificationCountUser}</Text>
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
    position: "relative",
    width: "15%",
    marginHorizontal: 5,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  checklistIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
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
