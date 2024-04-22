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

import FormPin from "../Components/formPin";
import SearchUsername from "../Components/searchUsername";
import ModalTransferSuccess from "../Components/modalTransactionSuccess";
import { GetUser } from "../Components/Common/Hooks/getUser";

const Transfer = ({ navigation }) => {
  const { user, refetchUser } = GetUser();

  const [activeButton, setActiveButton] = useState({ active: null });
  const [modalTransferSuccess, setModalTransferSuccess] = useState(false);
  const [showPinForm, setShowPinForm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataTransferSuccess, setDataTransferSuccess] = useState({
    visible: false,
    data: {},
  });
  const [form, setForm] = useState({
    otherUserId: "",
    amount: "",
    transactionType: "transfer",
    pin: "",
  });
  const [error, setError] = useState({
    amount: "",
    balance: "",
    pin: "",
    otherUserId: "",
  });

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

  const handlePIN = async () => {
    try {
      const messageError = {
        amount:
          form.amount === ""
            ? "Amount is required"
            : form.amount < 10000
            ? "Amount can't be less than 10000"
            : "",
        otherUserId: form.otherUserId === "" ? "User is required" : "",
      };

      if (!messageError.amount && !messageError.otherUserId) {
        setShowPinForm(true);
      } else {
        setError(messageError);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return showPinForm ? (
    <SafeAreaView style={styles.containerTransfer}>
      <FormPin
        user={user}
        refetchUser={refetchUser}
        form={form}
        setForm={setForm}
        error={error}
        setError={setError}
        setModalTransactionSuccess={setModalTransferSuccess}
        setDataTransactionSuccess={setDataTransferSuccess}
      />
      <ModalTransferSuccess
        navigation={navigation}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalTransactionSuccess={modalTransferSuccess}
        setModalTransactionSuccess={setModalTransferSuccess}
        dataTransactionSuccess={dataTransferSuccess}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.containerTransfer}>
      <ScrollView style={styles.contentTransfer}>
        <View style={styles.contentTitleTransfer}>
          <Text style={styles.titleTransfer}>Transfer Rupiah</Text>
        </View>
        <SearchUsername
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
        />
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
            <TouchableOpacity style={styles.btnTransfer} onPress={handlePIN}>
              <Text style={styles.btnTextTransfer}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerTransfer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  contentTransfer: {
    width: "100%",
  },
  contentTitleTransfer: {
    width: "100%",
    height: 150,
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
    borderRadius: 25,
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
    color: "#808080",
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
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 25,
    backgroundColor: "#3CB371",
  },
  btnTextTransfer: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
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
