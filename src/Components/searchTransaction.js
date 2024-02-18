import { useEffect } from "react";
import { StyleSheet, View, TextInput } from "react-native";

function SearchTransaction({
  transactionsUser,
  refetchTransactionsUser,
  search,
  setSearch,
  setOption,
  page,
  setPage,
  currentPageData,
  setCurrentPageData,
  setIsListEnd,
}) {
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
    filterData(value);
    setOption("");
  };

  const filterData = (value) => {
    if (value !== "") {
      const filteredData = transactionsUser?.filter((transaction) =>
        transaction?.id.toLowerCase().includes(value.toLowerCase())
      );

      setCurrentPageData(filteredData);
    } else {
      if (transactionsUser?.length > 0) {
        if (page === 1) {
          setCurrentPageData(transactionsUser);
          setPage(page + 1);
        } else {
          setCurrentPageData([...currentPageData, ...transactionsUser]);
          setPage(page + 1);
        }
      } else {
        setIsListEnd(true);
      }
    }
  };

  useEffect(() => {
    filterData(search);
  }, [transactionsUser, search]);

  useEffect(() => {
    refetchTransactionsUser();
  }, [search]);

  return (
    <View style={styles.contentSearch}>
      <TextInput
        style={styles.inputSearch}
        placeholder="Search id transaction....."
        onChangeText={(value) => handleSearch(value)}
        value={search}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});

export default SearchTransaction;
