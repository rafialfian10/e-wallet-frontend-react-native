import { useState, useEffect, useMemo, useCallback } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import Spinner from "react-native-loading-spinner-overlay";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { GetTransactionsUser } from "../Components/Common/Hooks/getTransactionsUser";
import DisplayHistory from "../Components/displayHistory";

const History = () => {
  const [search, setSearch] = useState("");
  const [option, setOption] = useState("");

  const [currentPageData, setCurrentPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);

  const {
    transactionsUser,
    isLoadingTransactionUser,
    refetchTransactionsUser,
  } = GetTransactionsUser(page);

  useEffect(() => {
    refetchTransactionsUser();
  }, [page]);

  const selectOptions = [
    { key: "", value: "all" },
    { key: "transfer", value: "transfer" },
    { key: "topup", value: "topup" },
  ];

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleOptionChange = (value) => {
    setOption(value);
    setPage(1);
  };

  useEffect(() => {
    refetchTransactionsUser();
    if (option !== "") {
      setSearch("");
    }

    if(search !== "") {
      setOption("")
    }
  }, [search, option]);

  const filteredTransactions = useMemo(() => {
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

  // pagination
  const getData = () => {
    if (!isLoadingTransactionUser && !isListEnd) {
      try {
        if (filteredTransactions?.length > 0) {
          setPage(page + 1);
          setCurrentPageData([...currentPageData, ...filteredTransactions]);
        } else {
          setIsListEnd(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {isLoadingTransactionUser ? (
          <ActivityIndicator color="black" size={24} />
        ) : null}
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }) => <DisplayHistory transaction={item} />,
    []
  );

  useEffect(() => getData(), []);

  //  useEffect(() => {
  //   setCurrentPageData(filteredTransactions?.slice(0, page * 10));
  //   setIsListEnd(filteredTransactions?.length <= page * 10);
  // }, [filteredTransactions, page]);

  return (
    <SafeAreaView style={styles.containerHistory}>
      <View style={styles.contentHistory}>
        <View style={styles.contentTitleHistory}>
          <Text style={styles.title}>Transactions History</Text>
        </View>
        <View style={styles.contentSearch}>
          <TextInput
            style={styles.inputSearch}
            placeholder="Search id transaction....."
            onChangeText={handleSearch}
            value={search}
          />
        </View>
        <View style={styles.contentSelectOptions}>
          <SelectList
            setSelected={handleOptionChange}
            data={selectOptions}
            save="value"
            style={styles.selectOptions}
          />
        </View>
      </View>
      <View style={styles.containerPagination}>
        <FlatList
          data={currentPageData}
          keyExtractor={(item, index) => index.toString()}
          // ItemSeparatorComponent={ItemSeparatorView}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          onEndReached={getData}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ height: "auto", paddingBottom: 300 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerHistory: {
    flex: 1,
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
    marginBottom: 10,
    alignSelf: "flex-end",
  },
  selectOptions: {
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  containerPagination: {
    width: "100%",
  },
  footer: {
    width: "100%",
    padding: 15,
  }
});

export default History;
