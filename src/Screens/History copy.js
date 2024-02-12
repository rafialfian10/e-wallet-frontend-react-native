import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import Spinner from "react-native-loading-spinner-overlay";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";

import { GetTransactionsUser } from "../Components/Common/Hooks/getTransactionsUser";
import DisplayHistory from "../Components/displayHistory";

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

  const [currentPageItems, setCurrentPageItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    setCurrentPageItems(transactionsHistory.slice(startIndex, endIndex));
  }, [transactionsHistory, page]);

  const fetchPage = async () => {
    if (loading || page >= totalPages) {
      return;
    }
  
    setLoading(true);
  
    // Menunggu hingga transactionsHistory terinisialisasi
    if (!transactionsHistory) {
      await refetchTransactionsUser();
    }
  
    // Memperbarui data halaman saat ini
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const nextPageItems = transactionsHistory ? transactionsHistory.slice(startIndex, endIndex) : [];
  
    setCurrentPageItems((prevItems) => [...prevItems, ...nextPageItems]);
  
    // Memperbarui halaman selanjutnya
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  const renderItem = useCallback(
    ({ item }) => <DisplayHistory transaction={item} />,
    []
  );

  if (transactionsHistory?.length === 0) {
    return null;
  }

  const { width, height } = useWindowDimensions();
  const itemHeight = width + 500;

  return (
    <SafeAreaView style={styles.containerHistory}>
      {isLoadingTransactionUser ? (
        <Spinner
          visible={isLoadingTransactionUser}
          textContent={"Loading..."}
          textStyle={styles.spinner}
        />
      ) : (
        <>
          <View style={styles.contentHistory}>
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
          </View>
          {/* <View style={styles.containerPagination}>
            <FlatList
              data={currentPageItems}
              renderItem={renderItem}
              onEndReached={fetchPage}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => loading && <ActivityIndicator />}
              refreshing={loading}
              // onRefresh={onRefresh}
              // debug
              initialNumToRender={1}
              getItemLayout={(data, index) => ({
                length: itemHeight,
                offset: (itemHeight + 10) * index,
                index,
              })}
            />
          </View> */}
        </>
      )}
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
    borderColor: "red",
    borderWidth: 2,
  },
});

export default History;
