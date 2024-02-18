import { useEffect } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { StyleSheet, View } from "react-native";

function FilterTransaction({
  transactionsUser,
  refetchTransactionsUser,
  option,
  setOption,
  page,
  setPage,
  currentPageData,
  setCurrentPageData,
  setIsListEnd,
}) {
  const selectOptions = [
    { key: "", value: "all" },
    { key: "transfer", value: "transfer" },
    { key: "topup", value: "topup" },
  ];

  const handleOption = (value) => {
    setOption(value);
    setPage(1);
  };

  useEffect(() => {
    if (option !== "") {
      const filteredData = transactionsUser?.filter((transaction) =>
        transaction.transactionsType
          .toLowerCase()
          .includes(option.toLowerCase())
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

  useEffect(() => {
    refetchTransactionsUser();
    if (option !== "") {
      setSearch("");
    }
  }, [option]);

  return (
    <View style={styles.contentSelectOptions}>
      <SelectList
        setSelected={handleOption}
        data={selectOptions}
        save="value"
        style={styles.selectOptions}
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
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export default FilterTransaction;
