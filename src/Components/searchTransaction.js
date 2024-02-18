import { useEffect } from "react";
import { StyleSheet, View, TextInput } from "react-native";

function SearchTransaction({
  transactionsUser,
  search,
  setSearch,
  page,
  setPage,
  currentPageData,
  setCurrentPageData,
  setIsListEnd,
}) {
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    if (search !== "") {
      const filteredData = transactionsUser?.filter((transaction) =>
        transaction.id.toLowerCase().includes(search.toLowerCase())
      );
      setCurrentPageData(filteredData);
    } else {
      if (transactionsUser?.length > 0) {
        setPage(page + 1);
        setCurrentPageData([...currentPageData, ...transactionsUser]);
      } else {
        setIsListEnd(true);
      }
    }
  }, [transactionsUser, search]);

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
