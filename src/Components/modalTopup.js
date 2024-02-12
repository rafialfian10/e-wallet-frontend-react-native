import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { API } from "../Config/Api";
import { GetUser } from "./Common/Hooks/getUser";

function ModalTopup(props) {
  const { refetchUser } = GetUser();

  const { modalVisible, setModalVisible, handleTopupSuccess } = props;

  const [activeButton, setActiveButton] = useState({ active: null });
  const [form, setForm] = useState({ amount: "", pin: "960412", transactionType: "topup" });
  const [error, setError] = useState({ amount: "", pin: "" });

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });

    setActiveButton({ active: null });
  };

  const handleTopup = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Bearer Token": "Bearer " + AsyncStorage.getItem("token"),
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
      };

      setActiveButton({ active: null });

      if (!messageError.amount && !messageError.pin) {
        const body = JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          pin: parseInt(form.pin),
        });
        const response = await API.post("/topup", body, config);

        if (response.data.status === 200) {
          refetchUser();
          setModalVisible(false);
          setActiveButton({ active: null });
          setForm({ amount: "", pin: "" });
          setError({ amount: "", pin: "" });
          handleTopupSuccess(form);
        }
      } else {
        setError(messageError);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.containerModalTopup}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
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
                placeholder="Set top up amount"
                onChangeText={(value) => handleChange("amount", value)}
                value={form.amount}
              />
              {error.amount && (
                <Text style={styles.errorTopup}>{error.amount}</Text>
              )}
            </View>
            <View style={styles.contentBtnTopup}>
              <TouchableOpacity style={styles.btnTopup} onPress={handleTopup}>
                <Text style={styles.btnTextTopup}>Topup</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnTopup}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.btnTextTopup}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerModalTopup: {
    width: "100%",
  },
  centeredView: {
    width: "90%",
    flex: 0.8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  modalView: {
    width: "100%",
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    elevation: 5,
    shadowOpacity: 0.75,
    shadowRadius: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  contentListTopup: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  listTopup: {
    width: "30%",
    marginBottom: 15,
    padding: 5,
    borderRadius: 10,
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
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderBottomColor: "#3CB371",
  },
  errorTopup: {
    width: "100%",
    alignSelf: "center",
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
    width: 80,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#3CB371",
  },
  btnTextTopup: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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

export default ModalTopup;
