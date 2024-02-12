import { API } from "../Config/Api";
import { Alert } from "react-native";

const HandleDeletePhoto = ({
  state,
  refetchUser,
  setModalProfile,
  setNewURLPhoto,
}) => {
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

  handleDeletePhoto();

  return null;
};

export default HandleDeletePhoto;
