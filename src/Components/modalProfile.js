import { useState, useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import validator from "validator";
import {
  StyleSheet,
  View,
  Modal,
  Alert,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import { UserContext } from "../Context/UserContext";
import { API } from "../Config/Api";

const ModalProfile = ({
  refetchUser,
  form,
  setForm,
  error,
  setError,
  modalProfile,
  setModalProfile,
  newURLPhoto,
  setNewURLPhoto,
  PATH_FILE,
}) => {
  const [state, dispatch] = useContext(UserContext);

  const [gender, setGender] = useState(form.gender);

  const handleChange = (data, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [data]: value,
    }));

    if (data === "username") {
      if (value.trim() === "") {
        setError((prevError) => ({
          ...prevError,
          username: "Username is required",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          username: "",
        }));
      }
    }

    if (data === "email") {
      if (value.trim() === "") {
        setError((prevError) => ({
          ...prevError,
          email: "Email is required",
        }));
      } else if (!validator.isEmail(value)) {
        setError((prevError) => ({
          ...prevError,
          email: "Please enter a valid email address",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          email: "",
        }));
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + state?.user?.token,
        },
      };

      const messageError = {
        username: form.username === "" ? "Username is required" : "",
        email: form.email === "" ? "Email is required" : "",
        phone: form.phone === "" ? "Phone is required" : "",
      };

      if (
        !messageError.username &&
        !messageError.email &&
        !messageError.phone
      ) {
        const body = JSON.stringify(form);

        const response = await API.patch(
          `/user/${state?.user?.id}`,
          body,
          config
        );
        if (response?.data?.status === 200) {
          alert("Profile has been updated");
          refetchUser();
          setModalProfile(false);
        }
      } else {
        setError(messageError);
      }
    } catch (error) {
      console.log("profile failed to update", error);
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
        visible={modalProfile}
        onRequestClose={() => {
          setModalProfile(!modalProfile);
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          //   onPressOut={() => setModalProfile(false)}
        >
          <View style={styles.modalViewProfile}>
            <View style={styles.contentInputProfile}>
              <TextInput
                style={styles.InputProfile}
                placeholder="Username..."
                onChangeText={(value) => handleChange("username", value)}
                value={form.username}
              />
              {error.username && (
                <Text style={styles.errorProfile}>{error.username}</Text>
              )}
            </View>
            <View style={styles.contentInputProfile}>
              <TextInput
                editable={false}
                style={styles.InputProfile}
                placeholder="Email..."
                onChangeText={(value) => handleChange("email", value)}
                value={form.email}
              />
              {error.email && (
                <Text style={styles.errorProfile}>{error.email}</Text>
              )}
            </View>
            <View style={styles.contentInputProfile}>
              <TextInput
                editable={false}
                style={styles.InputProfile}
                keyboardType="numeric"
                placeholder="Phone..."
                maxLength={14}
                onChangeText={(value) => handleChange("phone", value)}
                value={form.phone}
              />
              {error.phone && (
                <Text style={styles.errorProfile}>{error.phone}</Text>
              )}
            </View>
            <View style={styles.contentSelectProfile}>
              <Picker
                style={styles.InputSelect}
                placeholder="Gender..."
                selectedValue={gender}
                onValueChange={(value, index) => {
                  setGender(value);
                  handleChange("gender", value);
                }}
              >
                <Picker.Item
                  label="Select Gender..."
                  value=""
                  style={styles.option}
                />
                <Picker.Item label="Male" value="male" style={styles.option} />
                <Picker.Item
                  label="Female"
                  value="female"
                  style={styles.option}
                />
              </Picker>
            </View>
            <View style={styles.contentInputProfile}>
              <TextInput
                style={styles.InputProfile}
                placeholder="Address..."
                onChangeText={(value) => handleChange("address", value)}
                value={form.address}
              />
            </View>
            <View style={styles.contentInputFileProfile}>
              {newURLPhoto?.photo &&
              newURLPhoto?.photo !== `${PATH_FILE}/static/photo/null` ? (
                <View>
                  <TouchableOpacity
                    style={styles.deletePhoto}
                    onPress={handleDeletePhoto}
                  >
                    <MaterialIcons name="cancel" size={26} color="red" />
                  </TouchableOpacity>
                  <Image
                    source={{ uri: newURLPhoto?.photo }}
                    style={styles.selectedPhoto}
                    alt="upload-photo"
                  />
                </View>
              ) : (
                <View></View>
              )}
            </View>
            <View style={styles.containerBtnUpdateClose}>
              <TouchableOpacity
                style={styles.btnUpdate}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.textBtnUpdateClose}>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setModalProfile(false)}
              >
                <Text style={styles.textBtnUpdateClose}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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
  InputProfile: {
    width: "100%",
    marginBottom: 5,
    fontSize: 12,
    borderWidth: 2,
    borderTopColor: "white",
    borderLeftColor: "white",
    borderRightColor: "white",
    borderBottomColor: "#A9A9A9",
  },
  contentSelectProfile: {
    width: "100%",
    height: 30,
    display: "flex", 
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 2,
    borderTopColor: "white",
    borderLeftColor: "white",
    borderRightColor: "white",
    borderBottomColor: "#A9A9A9",
  },
  InputSelect: {
    width: "115%",
    alignSelf: "center",
  },
  option: {
    fontSize: 12,
    color: "#000000",
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
  errorProfile: {
    width: "100%",
    height: 20,
    alignSelf: "center",
    fontSize: 11,
    color: "red",
  },
  containerBtnUpdateClose: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btnUpdate: {
    width: 80,
    marginHorizontal: 5,
    display: "flex",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#228B22",
  },
  btnCancel: {
    width: 80,
    display: "flex",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#F94449",
  },
  textBtnUpdateClose: {
    color: "white",
    fontWeight: "800",
  },
});

export default ModalProfile;
