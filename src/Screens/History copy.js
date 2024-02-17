import { useState, useEffect, useMemo, useCallback, useContext } from "react";
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
  useWindowDimensions,
} from "react-native";

import { GetTransactionsUser } from "../Components/Common/Hooks/getTransactionsUser";
import DisplayHistory from "../Components/displayHistory";
import { UserContext } from "../Context/UserContext";

const History = () => {
  const [state, dispatch] = useContext(UserContext);
  const token = state?.user?.token 

  const [search, setSearch] = useState("");
  const [option, setOption] = useState("");
  const [page, setPage] = useState(1);

  const {
    transactionsUser,
    isLoadingTransactionUser,
    refetchTransactionsUser,
  } = GetTransactionsUser(page);

  // useEffect(() => {
  //   refetchTransactionsUser();
  // }, [page]);

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

  const [loading, setLoading] = useState(false);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);

  useEffect(() => getData(), []);

  const getData = () => {
    if (!loading && !isListEnd) {
      setLoading(true);
      fetch(
        "http://192.168.88.106:5000/api/v1/transactions-by-user?page=" + offset, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson?.data?.length > 0) {
            setOffset(offset + 1);
            setCurrentPageData([...currentPageData, ...responseJson?.data]);
            setLoading(false);
          } else {
            setIsListEnd(true);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator color="black" style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }) => <DisplayHistory transaction={item} />,
    []
  );

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
                placeholder="Search id transaction....."
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
          <View style={styles.containerPagination}>
            <FlatList
              data={currentPageData}
              keyExtractor={(item, index) => index.toString()}
              // ItemSeparatorComponent={ItemSeparatorView}
              renderItem={renderItem}
              ListFooterComponent={renderFooter}
              onEndReached={getData}
              onEndReachedThreshold={0.5}
              contentContainerStyle={{height: "auto", paddingBottom: 300}}
            />
          </View>
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
  },
});

export default History;
