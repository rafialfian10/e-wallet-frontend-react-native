import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  View,
  Image,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";

import Parse from "./parse";

function ModalTransactionSuccess(props) {
  const {
    navigation,
    modalVisible,
    setModalVisible,
    modalTopupSuccess,
    setModalTopupSuccess,
    dataTransactionSuccess,
  } = props;

  const topup = dataTransactionSuccess?.data?.amount
    ? parseInt(dataTransactionSuccess?.data?.amount).toFixed(2).replace(/\./g, ",")
    : "0,00";

  return (
    <View style={styles.containerModalTransferSuccess}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalTopupSuccess}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalTopupSuccess(!modalVisible);
        }}
      >
        <LinearGradient
          colors={["#3cb371", "#98fb98", "#e0ffff"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.containerLinierGradient}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.contentImgCheck}>
                <Image
                  source={require("../../assets/check.png")}
                  style={styles.imgCheck}
                  alt="check"
                />
              </View>
              <Text style={styles.textStatusTransfer}>{dataTransactionSuccess?.data?.transactionType.charAt(0).toUpperCase() + dataTransactionSuccess?.data?.transactionType.slice(1)} Success</Text>
              <Text style={styles.textAmount}>Rp. {Parse(topup)}</Text>
              <Text style={styles.textInfoStatusTransfer}>
                Your {dataTransactionSuccess?.data?.transactionType} has been successfully
              </Text>
              <View style={styles.contentBtnDone}>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text
                    style={styles.textBtnDone}
                    onPress={() => {
                      navigation.navigate("Home");
                      setModalTopupSuccess(false);
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerModalTransferSuccess: {
    width: "100%",
    flex: 1,
  },
  containerLinierGradient: {
    flex: 1,
  },
  centeredView: {
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  modalView: {
    width: "90%",
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
  contentImgCheck: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imgCheck: {
    width: 150,
    height: 140,
  },
  textStatusTransfer: {
    width: "100%",
    marginTop: 30,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  textAmount: {
    width: "100%",
    marginBottom: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#808080",
  },
  textInfoStatusTransfer: {
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#808080",
  },
  contentBtnDone: {
    width: "100%",
    marginTop: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#3CB371",
  },
  textBtnDone: {
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default ModalTransactionSuccess;
