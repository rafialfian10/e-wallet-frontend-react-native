import { StyleSheet, View, TextInput, Text } from "react-native";

const FormRegister2 = ({ form, setForm, error, setError }) => {
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
  errorRegister: {
    width: "100%",
    paddingHorizontal: 10,
    alignSelf: "center",
    textAlign: "justify",
    fontSize: 11,
    color: "red",
  },
});

export default FormRegister2;
