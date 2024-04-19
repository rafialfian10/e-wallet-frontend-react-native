import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import validator from "validator";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";

const FormRegister1 = ({
  form,
  setForm,
  error,
  setError,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (data, value) => {
    setForm({
      ...form,
      [data]: value,
    });

    if (data === "username") {
      setError((prevError) => ({
        ...prevError,
        username: value.trim() === "" ? "Username is required" : "",
      }));
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

    if (data === "password") {
      setError((prevError) => ({
        ...prevError,
        password: value.trim() === "" ? "Password is required" : "",
      }));

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

      if (value.trim() !== "" && !passwordRegex.test(value)) {
        setError((prevError) => ({
          ...prevError,
          password:
            "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character",
        }));
      }
    }
  };

  return (
    <View style={styles.subContentInput}>
      <View style={styles.contentInput}>
        <TextInput
          style={styles.textInput}
          placeholder="Username..."
          onChangeText={(value) => handleChange("username", value)}
          value={form.username}
        />
        {error.username && (
          <Text style={styles.errorRegister}>{error.username}</Text>
        )}
      </View>
      <View style={styles.contentInput}>
        <TextInput
          style={styles.textInput}
          placeholder="Email..."
          onChangeText={(value) => handleChange("email", value)}
          value={form.email}
        />
        {error.email && <Text style={styles.errorRegister}>{error.email}</Text>}
      </View>
      <View style={styles.contentInput}>
        <TextInput
          style={styles.textInput}
          placeholder="Password..."
          secureTextEntry={!showPassword}
          onChangeText={(value) => handleChange("password", value)}
          value={form.password}
        />
        <TouchableOpacity
          style={styles.togglePasswordButton}
          onPress={handleTogglePassword}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#808080"
          />
        </TouchableOpacity>
        {error.password && (
          <Text style={styles.errorRegister}>{error.password}</Text>
        )}
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
    marginBottom: 10,
    borderRadius: 25,
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
  togglePasswordButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  errorRegister: {
    width: "100%",
    paddingHorizontal: 13,
    alignSelf: "center",
    textAlign: "justify",
    fontSize: 11,
    color: "red",
  },
});

export default FormRegister1;
