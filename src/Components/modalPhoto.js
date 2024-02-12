import { useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  View,
  Modal,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";

import { UserContext } from "../Context/UserContext";
import { API } from "../Config/Api";

function ModalPhoto(props) {
  const {
    refetchUser,
    setForm,
    modalPhotoProfile,
    setModalPhotoProfile,
    setModalProfile,
    setNewURLPhoto,
  } = props;

  const [state, dispatch] = useContext(UserContext);

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
        await handleUpdatePhotoProfile(result.assets[0].uri);
      }
    } catch (error) {
      console.log("photo failed to select", error);
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
        await handleUpdatePhotoProfile(result.assets[0].uri);
      }
    } catch (error) {
      console.log("camera error", error);
    }
  };

  const handleUpdatePhotoProfile = async (result) => {
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + state?.user?.token,
        },
      };

      const formData = new FormData();
      formData.append("photo", {
        uri: result,
        type: "image/jpeg",
        name: `${state?.user?.username}.jpg`,
      });
      console.log("body form", formData._parts);

      const response = await API.patch(
        `/user/${state?.user?.id}`,
        formData,
        config
      );

      if (response?.data?.status === 200) {
        alert("Photo has been successfully updated");
        refetchUser();
        setForm({
          username: "",
          email: "",
          phone: "",
          gender: "",
          address: "",
          photo: "",
        });
        setModalProfile(false);
        setModalPhotoProfile(false);
      }
    } catch (error) {
      console.log("photo failed to upload", error);
      alert("Failed to update photo. Please check your network connection.");
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + state?.user?.token,
        },
      };

      Alert.alert(
        "Delete Photo",
        "Are you sure?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              const response = await API.delete(
                `/user/${state?.user?.id}/photo`,
                config
              );

              if (response?.status === 200) {
                alert("Photo has been deleted");
                refetchUser();
                setModalProfile(false);
                setNewURLPhoto();
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.log("photo failed to delete", error);
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPhotoProfile}
        oonRequestClose={() => {
          setModalPhotoProfile(!modalPhotoProfile);
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPressOut={() => setModalPhotoProfile(false)}
        >
          <View style={styles.modalViewPhotoProfile}>
            <TouchableOpacity
              style={styles.btnModalPhotoProfile}
              onPress={handleOpenCamera}
            >
              <FontAwesome name="camera" size={25} color="grey" />
              <Text style={styles.textModalPhotoProfile}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnModalPhotoProfile}
              onPress={handleOpenGallery}
            >
              <FontAwesome name="image" size={25} color="grey" />
              <Text style={styles.textModalPhotoProfile}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnModalPhotoProfile}
              onPress={handleDeletePhoto}
            >
              <FontAwesome name="trash" size={25} color="red" />
              <Text style={styles.textModalPhotoProfile}>Remove</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    width: "80%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  modalViewProfile: {
    width: "100%",
    margin: 20,
    padding: 35,
    borderRadius: 20,
    alignItems: "flex-end",
    backgroundColor: "#FFFFFF",
    elevation: 5,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  contentInputProfile: {
    width: "100%",
  },
  contentInputFileProfile: {
    width: "100%",
    marginTop: 20,
  },
  selectedPhoto: {
    width: "95%",
    height: 200,
    alignSelf: "center",
  },
  deletePhoto: {
    position: "absolute",
    top: -10,
    right: -5,
    zIndex: 1,
  },
  modalViewPhotoProfile: {
    width: "100%",
    margin: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    padding: 35,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnModalPhotoProfile: {
    alignItems: "center",
  },
  textModalPhotoProfile: {
    marginTop: 10,
    fontWeight: "500",
    color: "grey",
  },
});

export default ModalPhoto;
