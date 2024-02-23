import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

import { PATH_FILE } from "@env";

function DisplayMessage({ navigation, adminContact }) {
  return (
    <View style={styles.contentMessage}>
      <View style={styles.contactContainer}>
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
      </View>
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
    marginHorizontal: 5,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  contentTextMessage: {
    display: "flex",
    flexDirection: "column",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  message: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#808080",
  },
});

export default DisplayMessage;
