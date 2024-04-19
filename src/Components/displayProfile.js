import { useState, useEffect, useContext } from "react";
import { Ionicons, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";

import { PATH_FILE } from "@env";
import { GetUser } from "./Common/Hooks/getUser";
import { UserContext } from "../Context/UserContext";

function DisplayProfile({ navigation }) {
  const [state, dispatch] = useContext(UserContext);

  const { user } = GetUser();

  const [newURLPhoto, setNewURLPhoto] = useState();
  const [contentNavigation, setShowContentNavigation] = useState(false);

  const toggleContentNavigation = () => {
    setShowContentNavigation(!contentNavigation);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch({
      type: "LOGOUT",
      payload: {},
    });
    navigation.navigate("Index");
    Alert.alert("", "Logout successfully");
  };

  useEffect(() => {
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

  return (
    <View style={styles.contentProfile}>
      <Text style={styles.textProfile}>Hi {user?.username}</Text>
      <Pressable
        style={styles.contentPhoto}
        onPress={() => setShowContentNavigation(!contentNavigation)}
      >
        {newURLPhoto?.photo &&
        newURLPhoto?.photo !== `${PATH_FILE}/static/photo/null` ? (
          <Image
            source={{ uri: newURLPhoto?.photo }}
            style={styles.photo}
            alt="photo"
          />
        ) : (
          <Image
            source={require("../../assets/default-photo.png")}
            style={styles.photo}
            alt="photo"
          />
        )}
        {contentNavigation && (
          <View style={styles.contentNavigation}>
            <TouchableOpacity
              style={styles.btnProfile}
              onPress={() => {
                navigation.navigate("Profile");
                toggleContentNavigation();
              }}
            >
              <Text style={styles.textBtn}>
                <FontAwesome6 name="user-large" size={16} color="#000000" />{" "}
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnQrCode}
              onPress={() => {
                navigation.navigate("QrCode");
                toggleContentNavigation();
              }}
            >
              <Text style={styles.textBtn}>
                <Ionicons name="qr-code-outline" size={16} color="#000000" /> QR
                Code
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnLogout}
              onPress={() => {
                handleLogout();
                toggleContentNavigation();
              }}
            >
              <Text style={styles.textBtn}>
                <FontAwesome name="sign-out" size={16} color="#000000" /> Logout
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contentProfile: {
    width: "90%",
    marginVertical: 20,
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  textProfile: {
    width: "50%",
    display: "flex",
    paddingVertical: 10,
    alignItems: "center",
    fontWeight: "600",
    fontSize: 24,
    color: "#000000",
  },
  contentPhoto: {
    width: "50%",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  contentNavigation: {
    width: 150,
    position: "absolute",
    top: 55,
    right: 0,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    elevation: 5,
    shadowOpacity: 0.75,
    shadowRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  btnProfile: {
    width: "100%",
    marginBottom: 10,
  },
  btnQrCode: {
    width: "100%",
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
  },
  btnLogout: {
    width: "100%",
  },
  textBtn: {
    textAlign: "left",
    textAlignVertical: "center",
    fontSize: 14,
    color: "#000000",
  },
});

export default DisplayProfile;
