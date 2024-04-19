import { StyleSheet, TouchableOpacity, Text } from "react-native";

import { API } from "../Config/Api";

function BtnVerifyOtp({ navigation, form, setForm, setError }) {
  const handleVerifyOtp = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const messageError = {
        email: form.email === "" ? "Email is required" : "",
        otp: form.otp === "" ? "Otp is required" : "",
      };

      if (!messageError.email && !messageError.verifyOtp) {
        const body = JSON.stringify({email : form.email, otp: form.otp});

        try {
          const response = await API.post("/verify-otp", body, config);
          if (response?.data?.status === 200) {
            alert("Email Verification successfully");
            navigation.navigate("Login");
            setForm({
              username: "",
              email: "",
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
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            alert(error.response.data.message);
          } else if (error.response && error.response.status === 400) {
            alert(error.response.data.message);
          } else {
            throw error;
          }
        }
      } else {
        setError(messageError);
      }
    } catch (error) {
      console.log("verify otp failed", error);
    }
  };

  return (
    <TouchableOpacity style={styles.btnVerifyOtp} onPress={handleVerifyOtp}>
      <Text style={styles.btnTextVerifyOtp}>Verify</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnVerifyOtp: {
    width: "100%",
    height: 50,
    padding: 10,
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "#3CB371",
  },
  btnTextVerifyOtp: {
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center",
  },
});

export default BtnVerifyOtp;
