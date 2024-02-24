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
import ModalTransferSuccess from "../Components/modalTransactionSuccess";
import { GetUser } from "../Components/Common/Hooks/getUser";

const Topup = ({ navigation }) => {
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
    amount: "",
    pin: "",
    transactionType: "topup",
  });
  const [error, setError] = useState({ amount: "", pin: "" });

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
      };

      if (!messageError.amount) {
        setShowPinForm(true);
      } else {
        setError(messageError);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return showPinForm ? (
    <SafeAreaView style={styles.containerTopup}>
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
    <SafeAreaView style={styles.containerTopup}>
      <ScrollView style={styles.contentTopup}>
        <View style={styles.contentTitleTopup}>
          <Text style={styles.titleTopup}>Topup</Text>
        </View>
        <View style={styles.centeredView}>
          <View style={styles.contentListTopup}>
            <TouchableOpacity
              style={
                activeButton.active === 0
                  ? styles.listTopupActive
                  : styles.listTopup
              }
              onPress={() => {
                setActiveButton({ active: 0 });
                setForm({ ...form, amount: "50000" });
              }}
            >
              <Text style={styles.listTextTopup}>Rp. 50.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 1
                  ? styles.listTopupActive
                  : styles.listTopup
              }
              onPress={() => {
                setActiveButton({ active: 1 });
                setForm({ ...form, amount: "100000" });
              }}
            >
              <Text style={styles.listTextTopup}>Rp. 100.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 2
                  ? styles.listTopupActive
                  : styles.listTopup
              }
              onPress={() => {
                setActiveButton({ active: 2 });
                setForm({ ...form, amount: "200000" });
              }}
            >
              <Text style={styles.listTextTopup}>Rp. 200.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 3
                  ? styles.listTopupActive
                  : styles.listTopup
              }
              onPress={() => {
                setActiveButton({ active: 3 });
                setForm({ ...form, amount: "300000" });
              }}
            >
              <Text style={styles.listTextTopup}>Rp. 300.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 4
                  ? styles.listTopupActive
                  : styles.listTopup
              }
              onPress={() => {
                setActiveButton({ active: 4 });
                setForm({ ...form, amount: "500000" });
              }}
            >
              <Text style={styles.listTextTopup}>Rp. 500.000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeButton.active === 5
                  ? styles.listTopupActive
                  : styles.listTopup
              }
              onPress={() => {
                setActiveButton({ active: 5 });
                setForm({ ...form, amount: "1000000" });
              }}
            >
              <Text style={styles.listTextTopup}>Rp. 1000.000</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.textInputTopup}
              keyboardType="numeric"
              placeholder="Set topup amount"
              onChangeText={(value) => handleChange("amount", value)}
              value={form.amount}
            />
            {error.amount && (
              <Text style={styles.errorTopup}>{error.amount}</Text>
            )}
          </View>
          <View style={styles.contentBtnTopup}>
            <TouchableOpacity style={styles.btnTopup} onPress={handlePIN}>
              <Text style={styles.btnTextTopup}>Topup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerTopup: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
  contentTopup: {
    width: "100%",
  },
  contentTitleTopup: {
    width: "100%",
    height: 150,
    marginBottom: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#228B22",
  },
  titleTopup: {
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
  contentListTopup: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  listTopup: {
    width: "30%",
    marginBottom: 15,
    padding: 5,
    borderRadius: 25,
    backgroundColor: "#3CB371",
  },
  listTextTopup: {
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  textInputTopup: {
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
  contentBtnTopup: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btnTopup: {
    width: 90,
    marginHorizontal: 5,
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#3CB371",
  },
  btnTextTopup: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  listTopupActive: {
    width: "30%",
    marginBottom: 15,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#3CB371",
    opacity: 0.5,
  },
});

export default Topup;
