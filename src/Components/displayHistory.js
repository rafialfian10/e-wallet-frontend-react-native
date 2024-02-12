import moment from "moment";
import { StyleSheet, Text, View } from "react-native";

import Parse from "./parse";

function DisplayHistory({ transaction }) {
  const amount = transaction?.amount
    ? transaction?.amount.toFixed(2).replace(/\./g, ",")
    : "0,00";
  return (
    <View style={styles.contentTransactionHistory}>
      <View style={styles.subContentTransactionHistory}>
        <View style={styles.contentTransactionType}>
          <Text style={styles.textTransaction}>
            {transaction?.transactionType}
          </Text>
          <Text style={styles.textAmount}>Rp. {Parse(amount)}</Text>
        </View>
        <View style={styles.contentTransactionDate}>
          <Text style={styles.textId}>
            {transaction?.id.length > 30
              ? transaction?.id.substring(0, 27) + "..."
              : transaction?.id}
          </Text>
          <Text style={styles.textDate}>
            {transaction?.transactionDate
              ? moment(transaction.transactionDate).format(
                  "DD MMMM YYYY, HH:mm:ss"
                )
              : ""}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentTransactionHistory: {
    width: "100%",
  },
  subContentTransactionHistory: {
    width: "95%",
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#808080",
  },
  contentTransactionType: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
  },
  textTransaction: {
    width: "100%",
    height: 30,
    textAlignVertical: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  textAmount: {
    width: "100%",
    fontSize: 12,
    color: "#808080",
  },
  contentTransactionDate: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
  },
  textId: {
    width: "100%",
    height: 30,
    textAlign: "right",
    textAlignVertical: "center",
    fontSize: 12,
    color: "#000000",
  },
  textDate: {
    width: "100%",
    textAlign: "right",
    fontSize: 12,
    color: "#808080",
  },
});

export default DisplayHistory;
