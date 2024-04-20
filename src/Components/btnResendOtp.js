import { StyleSheet, TouchableOpacity, Text } from "react-native";

import { API } from "../Config/Api";

function BtnResendOtp({ form, setError, setExpiryTime }) {
  const handleResendOtp = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const messageError = {
        email: form.email === "" ? "Email is required" : "",
      };

      if (!messageError.email) {
        const body = JSON.stringify({ email: form.email });

        try {
          const response = await API.post("/resend-otp", body, config);
          if (response.status === 200) {
            setExpiryTime(response.data.data.ttl);
            console.log(response.data.message);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            alert(error.response.data.message);
          } else {
            throw error;
          }
        }
      } else {
        setError(messageError);
      }
    } catch (error) {
      console.log("resend otp failed", error);
    }
  };

  return (
    <TouchableOpacity style={styles.btnResendOtp} onPress={handleResendOtp}>
      <Text style={styles.btnTextResendOtp}>Resend OTP</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnResendOtp: {
    marginTop: 5,
    paddingHorizontal: 15,
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
  },
  btnTextResendOtp: {
    color: "#808080",
    fontWeight: "800",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default BtnResendOtp;
