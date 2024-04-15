import { useState, useEffect } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";

import ModalProfile from "../Components/modalProfile";
import ModalPhoto from "../Components/modalPhoto";
import RefreshPage from "../Components/refreshPage";
import { PATH_FILE } from "@env";
import { GetUser } from "../Components/Common/Hooks/getUser";

const Profile = () => {
  const { user, isLoadingUser, refetchUser } = GetUser();

  const [modalProfile, setModalProfile] = useState(false);
  const [modalPhotoProfile, setModalPhotoProfile] = useState(false);
  const [newURLPhoto, setNewURLPhoto] = useState();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    photo: "",
  });
  const [error, setError] = useState({
    username: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    setForm({
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      address: user?.address || "",
      photo: user?.photo || "",
    });

    // replace http://localhost:5000 with PATH_FILE
    if (user?.photo) {
      const updatedPhotoURL = user?.photo.replace(
        "http://localhost:5000",
        PATH_FILE
      );

      setNewURLPhoto((prevForm) => ({
        ...prevForm,
        photo: updatedPhotoURL,
      }));
    }
  }, [user]);

  const handleRefresh = () => {
    refetchUser();
  };

  return (
    <SafeAreaView style={styles.containerProfile}>
      {isLoadingUser ? (
        <Spinner
          visible={isLoadingUser}
          textContent={"Loading..."}
          textStyle={styles.spinner}
        />
      ) : (
        <RefreshPage pageStyle={styles.contentProfile} onRefresh={handleRefresh}>
          <View style={styles.subContentProfile}>
            <TouchableOpacity
              style={styles.hamburger}
              onPress={() => setModalProfile(true)}
            >
              <MaterialCommunityIcons name="menu" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.contentUserName}>
              <Text style={styles.textUsername}>{user?.username}</Text>
            </View>
            <View style={styles.contentPhotoProfile}>
              {newURLPhoto?.photo &&
              newURLPhoto?.photo !== `${PATH_FILE}/static/photo/null` ? (
                <Image
                  source={{ uri: newURLPhoto?.photo }}
                  style={styles.photoProfile}
                  alt="photo"
                />
              ) : (
                <Image
                  source={require("../../assets/default-photo.png")}
                  style={styles.photoProfile}
                  alt="default-photo"
                />
              )}
              <TouchableHighlight
                style={styles.updatePhotoIcon}
                onPress={() => setModalPhotoProfile(true)}
              >
                <FontAwesome
                  name="camera"
                  size={15}
                  color="white"
                  style={styles.cameraIcon}
                />
              </TouchableHighlight>
            </View>
          </View>
          <View style={styles.contentDataProfile}>
            <View style={styles.subContentDataProfile}>
              <Text style={styles.textKey}>Name : </Text>
              <Text style={styles.textValue}>{user?.username}</Text>
            </View>
            <View style={styles.subContentDataProfile}>
              <Text style={styles.textKey}>Email : </Text>
              <Text style={styles.textValue}>{user?.email}</Text>
            </View>
            <View style={styles.subContentDataProfile}>
              <Text style={styles.textKey}>Phone : </Text>
              <Text style={styles.textValue}>{user?.phone}</Text>
            </View>
            <View style={styles.subContentDataProfile}>
              <Text style={styles.textKey}>Gender : </Text>
              <Text style={styles.textValue}>{user?.gender}</Text>
            </View>
            <View style={styles.subContentDataProfile}>
              <Text style={styles.textKey}>Address : </Text>
              <Text style={styles.textValue}>{user?.address}</Text>
            </View>
          </View>
          <ModalProfile
            refetchUser={refetchUser}
            form={form}
            setForm={setForm}
            error={error}
            setError={setError}
            modalProfile={modalProfile}
            setModalProfile={setModalProfile}
            newURLPhoto={newURLPhoto}
            setNewURLPhoto={setNewURLPhoto}
            PATH_FILE={PATH_FILE}
          />
          <ModalPhoto
            refetchUser={refetchUser}
            setForm={setError}
            modalPhotoProfile={modalPhotoProfile}
            setModalPhotoProfile={setModalPhotoProfile}
            setModalProfile={setModalProfile}
            setNewURLPhoto={setNewURLPhoto}
          />
        </RefreshPage>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerProfile: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  spinner: {
    marginTop: -80,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    color: "#808080",
  },
  contentProfile: {
    flex: 1,
  },
  subContentProfile: {
    width: "100%",
    flex: 1,
  },
  hamburger: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 5,
    right: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  imageHamburger: {
    padding: 10,
  },
  contentBtnOpenModal: {
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  btnOpenModal: {
    alignSelf: "center",
    borderRadius: 5,
    padding: 10,
  },
  textOpenModal: {
    borderRadius: 10,
    color: "grey",
    fontWeight: "800",
    textAlign: "center",
  },
  contentUserName: {
    width: "100%",
    height: 150,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#228B22",
  },
  textUsername: {
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  contentPhotoProfile: {
    width: 80,
    height: 80,
    position: "relative",
    top: -40,
    left: 20,
    alignItems: "center",
    padding: 2,
    borderRadius: 40,
    borderColor: "grey",
    borderWidth: 2,
  },
  photoProfile: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  updatePhotoIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "grey",
    borderRadius: 15,
    zIndex: 5,
    padding: 5,
  },
  cameraIcon: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  contentDataProfile: {
    width: "90%",
    alignSelf: "center",
  },
  subContentDataProfile: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    paddingVertical: 5,
    borderWidth: 2,
    borderTopColor: "#FFFFFF",
    borderLeftColor: "#FFFFFF",
    borderRightColor: "#FFFFFF",
    borderBottomColor: "#808080",
  },
  textKey: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000"
  },
  textValue: {
    fontSize: 14,
    color: "#808080",
  },
});

export default Profile;
