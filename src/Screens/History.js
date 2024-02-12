import { useState, useEffect, useMemo } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment/moment";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  FlatList,
} from "react-native";

import Parse from "../Components/parse";
import { GetTransactionsUser } from "../Components/Common/Hooks/getTransactionsUser";

const History = () => {
  const {
    transactionsUser,
    isLoadingTransactionUser,
    refetchTransactionsUser,
  } = GetTransactionsUser();

  const [search, setSearch] = useState("");
  const [option, setOption] = useState("");

  const selectOptions = [
    { key: "", value: "all" },
    { key: "transfer", value: "transfer" },
    { key: "topup", value: "topup" },
  ];

  const handleSearch = (value) => {
    setSearch(value);
    if (value !== "") {
      setOption("");
    }
  };

  useEffect(() => {
    refetchTransactionsUser();
    if (option !== "") {
      setSearch("");
    }
  }, [option]);

  const transactionsHistory = useMemo(() => {
    if ((search === "" && option === "") || option === "all") {
      return transactionsUser;
    }

    return transactionsUser?.filter((transaction) => {
      const isOption = transaction.transactionType
        .toLowerCase()
        .includes(option.toLowerCase());
      const isSearch = transaction.id
        .toLowerCase()
        .includes(search.toLowerCase());

      if (search !== "") {
        return isSearch;
      } else if (option !== "") {
        return isOption;
      } else {
        return isOption && isSearch;
      }
    });
  }, [transactionsUser, search, option]);

  return (
    <SafeAreaView style={styles.containerHistory}>
      {isLoadingTransactionUser ? (
        <Spinner
          visible={isLoadingTransactionUser}
          textContent={"Loading..."}
          textStyle={styles.spinner}
        />
      ) : (
        <ScrollView style={styles.contentHistory}>
          <View style={styles.contentTitleHistory}>
            <Text style={styles.title}>Transactions History</Text>
          </View>
          <View style={styles.contentSearch}>
            <TextInput
              style={styles.inputSearch}
              placeholder="Search by id transaction....."
              onChangeText={(value) => handleSearch(value)}
              value={search}
            />
          </View>
          <View style={styles.contentSelectOptions}>
            <SelectList
              setSelected={setOption}
              data={selectOptions}
              save="value"
              style={styles.selectOptions}
            />
          </View>
          <View style={styles.contentTransactionHistory}>
            {transactionsHistory?.map((transaction, i) => {
              const amount = transaction?.amount
                ? transaction?.amount.toFixed(2).replace(/\./g, ",")
                : "0,00";
              return (
                <View style={styles.subContentTransactionHistory} key={i}>
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
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerHistory: {
    flex: 1,
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  spinner: {
    marginTop: -80,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    color: "#808080",
  },
  contentHistory: {
    width: "100%",
    flex: 1,
  },
  contentTitleHistory: {
    width: "100%",
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#228B22",
  },
  title: {
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  contentSearch: {
    width: "100%",
  },
  inputSearch: {
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#808080",
  },
  contentSelectOptions: {
    width: "50%",
    marginBottom: 20,
    alignSelf: "flex-end",
  },
  selectOptions: {
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: "red",
  },
  contentTransactionHistory: {
    width: "100%",
    marginBottom: 30,
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
  containerPagination: {
    width: "100%",
    marginBottom: 30,
  },
});

export default History;
