import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import SearchUsername from "../Components/SearchUsername";
import ModalTransferSuccess from "../Components/modalTransactionSuccess";
import { GetUser } from "../Components/Common/Hooks/getUser";
import { API } from "../Config/Api";

const Transfer = ({ navigation }) => {
  const { refetchUser } = GetUser();

  const [activeButton, setActiveButton] = useState({ active: null });
  const [modalTransferSuccess, setModalTransferSuccess] = useState(false);
  const [dataTransferSuccess, setDataTransferSuccess] = useState({
    visible: false,
    data: {},
  });
  const [form, setForm] = useState({
    amount: "",
    pin: "960412",
    otherUserId: "",
    transactionType: "transfer"
  });
  const [error, setError] = useState({ amount: "", pin: "", otherUserId: "" });

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

  const handleTransfer = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Bearer Token": "Bearer " + AsyncStorage.getItem("Token"),
        },
      };

      const messageError = {
        amount:
          form.amount === ""
            ? "Amount is required"
            : form.amount < 10000
            ? "Amount can't be less than 10000"
            : "",
        pin: form.pin === "" ? "Pin is required" : "",
        otherUserId: form.otherUserId === "" ? "User is required" : "",
      };

      if (
        !messageError.amount &&
        !messageError.pin &&
        !messageError.otherUserId
      ) {
        const body = JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          pin: parseInt(form.pin),
          otherUserId: form.otherUserId,
        });

        const response = await API.post("/transfer", body, config);
        if (response.data.status === 200) {
          refetchUser();
          setActiveButton({ active: null });
          setForm({ amount: "", pin: "", otherUserId: "" });
          setError({ amount: "", pin: "", otherUserId: "" });
          setModalTransferSuccess(true);
          setDataTransferSuccess({ visible: true, data: form });
        }
      } else {
        setError(messageError);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.containerTransfer}>
      <ScrollView style={styles.contentTransfer}>
        <View style={styles.contentTitleTransfer}>
          <Text style={styles.titleTransfer}>Transfer</Text>
        </View>
        <SearchUsername form={form} setForm={setForm} error={error} setError={setError} />
        <View style={styles.centeredView}>
          <View style={styles.contentListTransfer}>
            <TouchableOpacity
              style={
                activeButton.active === 0
                  ? styles.listTransferActive
                  : styles.listTransfer
              }
              onPress={() => {
                setActiveButton({ active: 0 });
                setForm({ ...form, amount: "50000" });
              }}
            >
              <Text style={styles.listTextTransfer}>Rp. 50.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 1
                  ? styles.listTransferActive
                  : styles.listTransfer
              }
              onPress={() => {
                setActiveButton({ active: 1 });
                setForm({ ...form, amount: "100000" });
              }}
            >
              <Text style={styles.listTextTransfer}>Rp. 100.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 2
                  ? styles.listTransferActive
                  : styles.listTransfer
              }
              onPress={() => {
                setActiveButton({ active: 2 });
                setForm({ ...form, amount: "200000" });
              }}
            >
              <Text style={styles.listTextTransfer}>Rp. 200.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 3
                  ? styles.listTransferActive
                  : styles.listTransfer
              }
              onPress={() => {
                setActiveButton({ active: 3 });
                setForm({ ...form, amount: "300000" });
              }}
            >
              <Text style={styles.listTextTransfer}>Rp. 300.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 4
                  ? styles.listTransferActive
                  : styles.listTransfer
              }
              onPress={() => {
                setActiveButton({ active: 4 });
                setForm({ ...form, amount: "500000" });
              }}
            >
              <Text style={styles.listTextTransfer}>Rp. 500.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 5
                  ? styles.listTransferActive
                  : styles.listTransfer
              }
              onPress={() => {
                setActiveButton({ active: 5 });
                setForm({ ...form, amount: "1000000" });
              }}
            >
              <Text style={styles.listTextTransfer}>Rp. 1000.000</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.textInputTransfer}
              keyboardType="numeric"
              placeholder="Set top up amount"
              onChangeText={(value) => handleChange("amount", value)}
              value={form.amount}
            />
            {error.amount && (
              <Text style={styles.errorTransfer}>{error.amount}</Text>
            )}
          </View>
          <View style={styles.contentBtnTransfer}>
            <TouchableOpacity
              style={styles.btnTransfer}
              onPress={handleTransfer}
            >
              <Text style={styles.btnTextTransfer}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ModalTransferSuccess
        navigation={navigation}
        modalVisible={modalTransferSuccess}
        setModalVisible={setModalTransferSuccess}
        modalTopupSuccess={modalTransferSuccess}
        setModalTopupSuccess={setModalTransferSuccess}
        dataTransactionSuccess={dataTransferSuccess}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerTransfer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
  contentTransfer: {
    width: "100%",
  },
  contentTitleTransfer: {
    width: "100%",
    height: 100,
    marginBottom: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#228B22",
  },
  titleTransfer: {
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
  contentListTransfer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  listTransfer: {
    width: "30%",
    marginBottom: 15,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#3CB371",
  },
  listTextTransfer: {
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  textInputTransfer: {
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
    alignSelf: "center",
    borderWidth: 2,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    borderBottomColor: "#808080",
  },
  errorTransfer: {
    width: "100%",
    alignSelf: "center",
    fontSize: 12,
    color: "red",
  },
  contentBtnTransfer: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btnTransfer: {
    width: 90,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#3CB371",
  },
  btnTextTransfer: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  listTransferActive: {
    width: "30%",
    marginBottom: 15,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#3CB371",
    opacity: 0.5,
  },
});

export default Transfer;
