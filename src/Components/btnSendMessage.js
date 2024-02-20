import { useState } from "react";
import { Ionicons, MaterialIcons, EvilIcons } from "@expo/vector-icons";
import { StyleSheet, View, TextInput, Pressable } from "react-native";

import { API } from "../Config/Api";
import HandleOpenGallery from "./handleOpenGallery";
import HandleOpenCamera from "./handleOpenCamera";

function BtnSendMessage({ state, refetchUser }) {
  const [form, setForm] = useState({
    message: "",
    file: "",
    recipientId: "2dd351cd-51eb-4113-a707-dc496e55c5ee",
  });

  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });
  };

  const handleSendMessage = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + state?.user?.token,
        },
      };

      const formData = new FormData();
      if (form.message != "") {
        formData.append("message", form.message);
      }
      if (form.file !== "") {
        formData.append("file", {
          uri: form.file,
          type: "image/jpeg",
          name: `${state?.user?.username}.jpg`,
        });
      }
      formData.append("recipientId", form.recipientId);

      const response = await API.post(`/chat`, formData, config);
      if (response?.data?.status === 200) {
        alert("OK");
        refetchUser();
        setForm({
          message: "",
          file: "",
          recipientId: "2dd351cd-51eb-4113-a707-dc496e55c5ee",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.contentBtnMessage}>
      <TextInput
        placeholder="Type a message"
        style={styles.inputMessage}
        onChangeText={(value) => handleChange("message", value)}
        value={form.message}
      />
      <View style={styles.contentIcon}>
        <Pressable style={styles.iconAttachFile}>
          <MaterialIcons
            name="attach-file"
            size={22}
            color="#808080"
            onPress={() => HandleOpenGallery({ form, setForm })}
          />
        </Pressable>
        {form.message !== "" ? (
          <View></View>
        ) : (
          <Pressable style={styles.iconCamera}>
            <EvilIcons
              name="camera"
              size={28}
              color="#808080"
              onPress={() => HandleOpenCamera({ form, setForm })}
            />
          </Pressable>
        )}
      </View>
      <Pressable onPress={handleSendMessage} style={styles.btnSend}>
        <Ionicons name="send" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contentBtnMessage: {
    width: "95%",
    position: "relative",
    bottom: 0,
    paddingBottom: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    zIndex: 10,
  },
  inputMessage: {
    width: "85%",
    height: 50,
    paddingLeft: 10,
    paddingRight: 40,
    textAlign: "left",
    textAlignVertical: "center",
    borderRadius: 25,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  contentIcon: {
    position: "absolute",
    right: 70,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  iconAttachFile: {},
  iconCamera: {
    marginLeft: 10,
  },
  btnSend: {
    width: "14%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#38B03E",
  },
});

export default BtnSendMessage;
