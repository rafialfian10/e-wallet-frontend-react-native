// import RNFetchBlob from "rn-fetch-blob";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

function DisplayChat({
  state,
  userContact,
  adminContact,
  messages,
  holdIndexes,
  setHoldIndexes,
}) {
  const handleDownloadFile = (file) => {
    try {
      console.log(file);
      // let dirs = RNFetchBlob.fs.dirs;
      // config({
      //   // addAndroidDownloads: {
      //   //   useDownloadManager: true,
      //   //   notification: true,
      //   //   mediaScannable: true,
      //   //   title: `${file}`,
      //   // },
      //   path: dirs.DocumentDir + "/path-to-file.anything",
      // })
      //   .fetch("GET", file)
      //   .then((res) => {
      //     console.log("The file saved to ", res.path());
      //   });
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <View style={styles.contentChat}>
      {userContact || adminContact ? (
        messages?.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.subContentChat,
              {
                alignSelf:
                  item?.senderId === state?.user?.id
                    ? "flex-end"
                    : "flex-start",
              },
              {
                backgroundColor:
                  item?.senderId === state?.user?.id ? "#B0FFC9" : "#FFFFFF",
              },
              {
                marginLeft: item?.senderId === state?.user?.id ? 20 : 0,
              },
              {
                marginRight: item?.senderId === state?.user?.id ? 0 : 20,
              },
              {
                marginRight: item?.senderId === state?.user?.id ? 0 : 20,
              },
              {
                opacity: holdIndexes.includes(item?.id) ? 0.5 : 1,
              },
            ]}
            onLongPress={() => handleHold(item?.id)}
            onPress={() => handleClick(item?.id)}
          >
            {item?.files !== null
              ? item.files.map((file, i) => (
                  <View key={i} style={styles.contentDownloadFile}>
                    <TouchableOpacity
                      style={styles.btnDownloadFile}
                      onPress={() => handleDownloadFile(file?.file)}
                    >
                      <MaterialCommunityIcons
                        name="download"
                        size={20}
                        color="#000000"
                      />
                    </TouchableOpacity>
                    <Text style={styles.textFile}>
                      {file?.file?.length > 30
                        ? file?.file.slice(0, 30) + "..."
                        : file?.file}
                    </Text>
                  </View>
                ))
              : ""}
            {item?.message !== "" ? (
              <View style={styles.contentMessage}>
                <Text style={styles.textMessage}>{item?.message}</Text>
                {item?.recipientId === adminContact?.id ||
                item?.recipientId === userContact?.id ? (
                  item?.notification ? (
                    <Ionicons
                      name="checkmark-outline"
                      size={15}
                      color="#000000"
                      style={styles.checklistIcon}
                    />
                  ) : (
                    <Ionicons
                      name="checkmark-done-outline"
                      size={15}
                      color="#3773DB"
                      style={styles.checklistIcon}
                    />
                  )
                ) : (
                  ""
                )}
              </View>
            ) : (
              ""
            )}
          </TouchableOpacity>
        ))
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
  subContentChat: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  contentDownloadFile: {
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  btnDownloadFile: {
    marginRight: 5,
  },
  textFile: {
    fontSize: 14,
    color: "#000000",
  },
  contentMessage: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  textMessage: {
    fontSize: 14,
    color: "#000000",
  },
  checklistIcon: {
    position: "relative",
    right: 0,
    top: 3,
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
