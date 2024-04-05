import { useEffect } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { StyleSheet, View } from "react-native";

function FilterTransaction({
  transactionsUser,
  refetchTransactionsUser,
  option,
  setOption,
  setSearch,
  page,
  setPage,
  currentPageData,
  setCurrentPageData,
  setIsListEnd,
}) {
  const selectOptions = [
    { key: "", value: "All" },
    { key: "transfer", value: "Transfer" },
    { key: "topup", value: "Topup" },
  ];

  const handleOption = (value) => {
    setOption(value);
    setPage(1);
    filterData(value);
    setSearch("");
  };

  const filterData = (value) => {
    if (value !== "") {
      const filteredData = transactionsUser?.filter(
        (transaction) =>
          transaction?.transactionType.toLowerCase() === value.toLowerCase()
      );

      if (filteredData?.length > 0) {
        if (page === 1) {
          setCurrentPageData(filteredData);
        } else {
          setCurrentPageData([...currentPageData, ...filteredData]);
        }
        setIsListEnd(false);
      }
    }
  };

  useEffect(() => {
    filterData(option);
  }, [transactionsUser, option]);

  useEffect(() => {
    refetchTransactionsUser();
  }, [option]);

  return (
    <View style={styles.contentSelectOptions}>
      <SelectList
        setSelected={handleOption}
        data={selectOptions}
        save="value"
        searchPlaceholder="search...."
        boxStyles={styles.selectOptions}
        dropdownStyles={styles.selectOptions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentSelectOptions: {
    width: "50%",
    marginBottom: 10,
    alignSelf: "flex-end",
  },
  selectOptions: {
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }
});

export default FilterTransaction;
