import moment from "moment";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

import { PATH_FILE } from "@env";

function DisplayMessage({ adminContact, usersContact, setShowChat, onClickUserContact }) {
  const handleShowChat = () => {
    setShowChat(true);
  };

  return (
    <View style={styles.contentMessage}>
      {usersContact?.length > 0 ? (
        usersContact.map((userContact, i) => (
          <TouchableOpacity
            key={i}
            style={styles.contactContainer}
            onPress={() => {handleShowChat(); onClickUserContact(userContact)}}
           
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
                <Text style={styles.date}>{moment(userContact?.createdAt).format('DD/MM/YY')}</Text>
              </View>
              <Text style={styles.message}>{userContact?.message}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <TouchableOpacity
          style={styles.contactContainer}
          onPress={handleShowChat}
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
          <View style={styles.contentTextMessage}>
            <Text style={styles.username}>{adminContact?.username}</Text>
            <Text style={styles.message}>{adminContact?.message}</Text>
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
    width: '100%',
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  message: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#808080",
  },
});

export default DisplayMessage;
