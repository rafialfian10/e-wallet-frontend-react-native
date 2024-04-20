import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";

import { API } from "../Config/Api";

const FormRegister2 = ({ navigation, form, setForm, error, setError, setScreen }) => {
  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });

    if (data === "phone") {
      setError((prevError) => ({
        ...prevError,
        phone: value.trim() === "" ? "Phone is required" : "",
      }));
    }
  };

  const handleRegister = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const messageError = {
        phone: form.phone === "" ? "Phone is required" : "",
      };

      if (!messageError.phone) {
        const body = JSON.stringify(form);

        try {
          const response = await API.post("/register", body, config);
          if (response?.data?.status === 201) {
            alert("Register successfully");
            setForm({
              username: "",
              email: form.email,
              password: "",
              phone: "",
              otp: "",
            });
            setError({
              username: "",
              email: "",
              password: "",
              phone: "",
              otp: "",
            });
            setScreen(2);
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            alert(error.response.data.message);
          } else {
            throw error;
          }
        }
      } else {
        setError(messageError);
      }
    } catch (error) {
      console.log("register failed", error);
    }
  };

  return (
    <View style={styles.subContentInput}>
      <View style={styles.contentInput}>
        <TextInput
          style={styles.textInput}
          placeholder="Phone..."
          onChangeText={(value) => handleChange("phone", value)}
          value={form.phone}
        />
        {error.phone && <Text style={styles.errorRegister}>{error.phone}</Text>}
      </View>
      <View style={styles.contentBtnRegister}>
        <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
          <Text style={styles.btnTextRegister}>Register</Text>
        </TouchableOpacity>
        <Text style={styles.textLogin}>
          Joined us before?
          <Text
            onPress={() => navigation.navigate("Login")}
            style={styles.linkLogin}
          >
            {" "}
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subContentInput: {
    width: "100%",
  },
  contentInput: {
    width: "100%",
    borderRadius: 25,
    marginBottom: 10,
    overflow: "hidden",
  },
  textInput: {
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 25,
    color: "#808080",
    backgroundColor: "#FFFFFF",
  },
  errorRegister: {
    width: "100%",
    paddingHorizontal: 13,
    alignSelf: "center",
    textAlign: "justify",
    fontSize: 11,
    color: "red",
  },
  contentBtnRegister: {
    width: "100%",
    marginTop: 130,
    borderRadius: 25,
    overflow: "hidden",
  },
  btnRegister: {
    width: "100%",
    height: 50,
    padding: 10,
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "#3CB371",
  },
  btnTextRegister: {
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center",
  },
  textLogin: {
    marginTop: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  linkLogin: {
    color: "#3CB371",
    fontWeight: "800",
  },
});

export default FormRegister2;
