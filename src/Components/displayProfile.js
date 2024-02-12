import { useState, useEffect, useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

import { PATH_FILE } from "@env";
import { GetUser } from "./Common/Hooks/getUser";
import { UserContext } from "../Context/UserContext";

function DisplayProfile({ navigation }) {
  const [state, dispatch] = useContext(UserContext);

  const { user } = GetUser();

  const [newURLPhoto, setNewURLPhoto] = useState();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch({
      type: "LOGOUT",
      payload: {},
    });
    navigation.navigate("Index");
    alert("Logout successfully");
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
      <TouchableOpacity
        style={styles.contentPhoto}
        onPress={() => setShowLogout(!showLogout)}
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
        {showLogout && (
          <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
            <Text style={styles.textLogout}>
              <FontAwesome name="sign-out" size={16} color="#000000" /> Logout
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
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
    fontWeight: "bold",
    fontSize: 25,
    color: "#808080",
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
  btnLogout: {
    width: 100,
    position: "absolute",
    top: 55,
    right: 0,
    padding: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  textLogout: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 14,
    color: "#000000",
  }
});

export default DisplayProfile;
