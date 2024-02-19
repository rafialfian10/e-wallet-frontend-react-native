import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons, EvilIcons } from "@expo/vector-icons";
import { StyleSheet, View, TextInput, Pressable } from "react-native";

import { API } from "../Config/Api";

function BtnSendMessage({ state, refetchUser }) {
  const [form, setForm] = useState({
    message: "",
    file: "",
    recipientId: "2dd351cd-51eb-4113-a707-dc496e55c5ee",
  });

  const handleOpenGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // solve: Key "cancelled" in the image picker result is deprecated, use "canceled" instead,
      delete result.cancelled;

      if (!result.canceled) {
        await handleSendMessage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("file failed to select", error);
    }
  };

  const handleOpenCamera = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      // solve: Key "cancelled" in the image picker result is deprecated, use "canceled" instead,
      delete result.cancelled;

      if (!result.canceled) {
        await handleSendMessage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("camera error", error);
    }
  };

  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });
  };

  const handleSendMessage = async (result) => {
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + state?.user?.token,
        },
      };

      const formData = new FormData();
      formData.append("message", form.message);
      formData.append("file", {
        uri: result,
        type: "image/jpeg",
        name: `${state?.user?.username}.jpg`,
      });
      formData.append("recipientId", form.recipientId);

      const response = await API.post(`/chat`, formData, config);
      if (response?.data?.status === 200) {
        refetchUser();
        setForm({
          message: "",
          file: "",
          recipientId: "",
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
            onPress={handleOpenGallery}
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
              onPress={handleOpenCamera}
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
