import QRCode from "react-native-qrcode-svg";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";

import Parse from "./parse";

function ModalGenerateQRCode(props) {
  const {
    navigation,
    user,
    modalGenerateQrCode,
    setModalGenerateQrCode,
    dataGenerateQrCode,
  } = props;

  const amount = dataGenerateQrCode?.amount
    ? parseInt(dataGenerateQrCode?.amount).toFixed(2).replace(/\./g, ",")
    : "0,00";

  const qrCode = {
    otherUserId: user?.id,
    amount: dataGenerateQrCode?.amount,
    transactionType: "transfer",
    pin: "",
  };

  return (
    <View style={styles.containerModalGenerateQrCode}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalGenerateQrCode}
        onRequestClose={() => {
          setModalGenerateQrCode(!modalGenerateQrCode);
        }}
      >
        <TouchableOpacity
          style={styles.contentCloseQrCode}
          onPress={() => {
            setModalGenerateQrCode(!modalGenerateQrCode);
            navigation.navigate("Home");
          }}
        >
          <Text style={styles.textClose}>Close</Text>
        </TouchableOpacity>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textInfoScanQrCode}>Scan QR Code</Text>
            <View style={styles.contentQrCode}>
              {qrCode ? (
                <QRCode value={JSON.stringify(qrCode)} size={200} />
              ) : null}
            </View>
            <Text style={styles.textAmount}>Total : Rp. {Parse(amount)}</Text>
            <View style={styles.contentScanQrCode}>
              <Text style={styles.textScanQrCode}>Scan qr code to pay</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerModalGenerateQrCode: {
    width: "100%",
  },
  contentCloseQrCode: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 20,
  },
  textClose: {
    fontSize: 16,
    color: "black",
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
    borderRadius: 25,
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
  textInfoScanQrCode: {
    width: "100%",
    marginVertical: 20,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  contentQrCode: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textAmount: {
    width: "100%",
    marginBottom: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#A9A9A9",
  },
  textInfoStatusTransfer: {
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#A9A9A9",
  },
  contentScanQrCode: {
    width: "100%",
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
    borderWidth: 1,
  },
  textScanQrCode: {
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
});

export default ModalGenerateQRCode;
