import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import DisplayHistory from "../Components/displayHistory";
import SearchTransaction from "../Components/searchTransaction";
import FilterTransaction from "../Components/filterTransaction";
import { GetTransactionsUser } from "../Components/Common/Hooks/getTransactionsUser";

const History = () => {
  const [refreshing, setRefreshing] = useState(false);
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

  const getData = () => {
    try {
      if (!isLoadingTransactionUser && !isListEnd) {
        if (transactionsUser && transactionsUser?.length > 0) {
          setPage(page + 1);
          setCurrentPageData([...currentPageData, ...transactionsUser]);
        } else {
          setIsListEnd(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = useCallback(
    ({ item }) => <DisplayHistory transaction={item} />,
    []
  );

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {isLoadingTransactionUser ? (
          <ActivityIndicator color="black" size={24} />
        ) : null}
      </View>
    );
  };

  useEffect(() => {
    getData();
  }, [page]);

  const handleRefresh = () => {
    setRefreshing(true);
    refetchTransactionsUser();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.containerHistory}>
      <View style={styles.contentHistory}>
        <View style={styles.contentTitleHistory}>
          <Text style={styles.title}>Transactions History</Text>
        </View>
        <SearchTransaction
          transactionsUser={transactionsUser}
          refetchTransactionsUser={refetchTransactionsUser}
          search={search}
          setSearch={setSearch}
          setOption={setOption}
          page={page}
          setPage={setPage}
          currentPageData={currentPageData}
          setCurrentPageData={setCurrentPageData}
          setIsListEnd={setIsListEnd}
        />
        <FilterTransaction
          transactionsUser={transactionsUser}
          refetchTransactionsUser={refetchTransactionsUser}
          option={option}
          setOption={setOption}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          currentPageData={currentPageData}
          setCurrentPageData={setCurrentPageData}
          setIsListEnd={setIsListEnd}
        />
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
          contentContainerStyle={styles.contentFlatLish}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerHistory: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  containerPagination: {
    width: "100%",
  },
  contentFlatLish: {
    height: "auto",
    paddingBottom: 300,
  },
  footer: {
    width: "100%",
    padding: 15,
  },
});

export default History;
