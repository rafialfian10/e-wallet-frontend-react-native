import { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import ModalGenerateQRCode from "../Components/modalGenerateQrCode";
import { GetUser } from "../Components/Common/Hooks/getUser";

const GenerateQrCode = ({ navigation }) => {
  const { user } = GetUser();

  const [activeButton, setActiveButton] = useState({ active: null });
  const [modalGenerateQrCode, setModalGenerateQrCode] = useState(false);
  const [form, setForm] = useState({ amount: "" });
  const [error, setError] = useState({ amount: "" });

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });

    setError({
      ...error,
      [name]: "",
    });

    setActiveButton({ active: null });
  };

  const handleGenerateQrCode = async () => {
    try {
      const messageError = {
        amount:
          form.amount === ""
            ? "Amount is required"
            : form.amount < 10000
            ? "Amount can't be less than 10000"
            : "",
      };

      if (!messageError.amount) {
        setModalGenerateQrCode(true);
      } else {
        setError(messageError);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return modalGenerateQrCode ? (
    <SafeAreaView style={styles.containerGenerateQrCode}>
      <ModalGenerateQRCode
        navigation={navigation}
        user={user}
        modalGenerateQrCode={modalGenerateQrCode}
        setModalGenerateQrCode={setModalGenerateQrCode}
        dataGenerateQrCode={form}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.containerGenerateQrCode}>
      <ScrollView style={styles.contentGenerateQrCode}>
        <View style={styles.contentTitleGenerateQrCode}>
          <Text style={styles.titleGenerateQrCode}>Generate QR</Text>
        </View>
        <View style={styles.centeredView}>
          <View style={styles.contentListGenerateQrCode}>
            <TouchableOpacity
              style={
                activeButton.active === 0
                  ? styles.ListGenerateQrCodeActive
                  : styles.listGenerateQrCode
              }
              onPress={() => {
                setActiveButton({ active: 0 });
                setForm({ ...form, amount: "50000" });
              }}
            >
              <Text style={styles.listTextGenerateQrCode}>Rp. 50.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 1
                  ? styles.ListGenerateQrCodeActive
                  : styles.listGenerateQrCode
              }
              onPress={() => {
                setActiveButton({ active: 1 });
                setForm({ ...form, amount: "100000" });
              }}
            >
              <Text style={styles.listTextGenerateQrCode}>Rp. 100.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 2
                  ? styles.ListGenerateQrCodeActive
                  : styles.listGenerateQrCode
              }
              onPress={() => {
                setActiveButton({ active: 2 });
                setForm({ ...form, amount: "200000" });
              }}
            >
              <Text style={styles.listTextGenerateQrCode}>Rp. 200.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 3
                  ? styles.ListGenerateQrCodeActive
                  : styles.listGenerateQrCode
              }
              onPress={() => {
                setActiveButton({ active: 3 });
                setForm({ ...form, amount: "300000" });
              }}
            >
              <Text style={styles.listTextGenerateQrCode}>Rp. 300.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 4
                  ? styles.ListGenerateQrCodeActive
                  : styles.listGenerateQrCode
              }
              onPress={() => {
                setActiveButton({ active: 4 });
                setForm({ ...form, amount: "500000" });
              }}
            >
              <Text style={styles.listTextGenerateQrCode}>Rp. 500.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 5
                  ? styles.ListGenerateQrCodeActive
                  : styles.listGenerateQrCode
              }
              onPress={() => {
                setActiveButton({ active: 5 });
                setForm({ ...form, amount: "1000000" });
              }}
            >
              <Text style={styles.listTextGenerateQrCode}>Rp. 1000.000</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.textInputGenerateQrCode}
              keyboardType="numeric"
              placeholder="Set generate qr code amount"
              onChangeText={(value) => handleChange("amount", value)}
              value={form.amount}
            />
            {error.amount && (
              <Text style={styles.errorTopup}>{error.amount}</Text>
            )}
          </View>
          <View style={styles.contentBtnGenerateQrCode}>
            <TouchableOpacity
              style={styles.btnGenerateQrCode}
              onPress={handleGenerateQrCode}
            >
              <Text style={styles.btnTextGenerateQrCode}>Generate QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerGenerateQrCode: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  contentGenerateQrCode: {
    width: "100%",
  },
  contentTitleGenerateQrCode: {
    width: "100%",
    height: 150,
    marginBottom: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#228B22",
  },
  titleGenerateQrCode: {
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  centeredView: {
    width: "100%",
    padding: 15,
    borderRadius: 20,
  },
  contentListGenerateQrCode: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  listGenerateQrCode: {
    width: "30%",
    marginBottom: 15,
    padding: 5,
    borderRadius: 25,
    backgroundColor: "#3CB371",
  },
  listTextGenerateQrCode: {
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  textInputGenerateQrCode: {
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
    alignSelf: "center",
    color: "#808080",
    borderWidth: 2,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    borderBottomColor: "#808080",
  },
  errorTopup: {
    width: "100%",
    alignSelf: "center",
    fontSize: 12,
    color: "red",
  },
  contentBtnGenerateQrCode: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btnGenerateQrCode: {
    width: 120,
    marginHorizontal: 5,
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#3CB371",
  },
  btnTextGenerateQrCode: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  ListGenerateQrCodeActive: {
    width: "30%",
    marginBottom: 15,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#3CB371",
    opacity: 0.5,
  },
});

export default GenerateQrCode;
