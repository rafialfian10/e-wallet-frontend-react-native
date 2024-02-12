import { useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { GetUsers } from "./Common/Hooks/getUsers";

const SearchUsername = ({ form, setForm, error, setError }) => {
  const { users, isLoadingUsers } = GetUsers();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = (value) => {
    setSearch(value);
    setSelectedUser(null);

    setError({
      ...error,
      otherUserId: "",
    });
  };

  const handleClick = (user) => {
    setForm({ ...form, otherUserId: user?.id });
    setSearch(user?.username);
    setSelectedUser(user);
  };

  const filteredUsers = users
    ? users.filter((user) =>
        user?.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <View style={styles.contentInput}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search user..."
        onChangeText={handleSearch}
        value={search}
      />
      {error.otherUserId && (
        <Text style={styles.errorTransfer}>{error.otherUserId}</Text>
      )}
      {isLoadingUsers ? (
        <Spinner
          visible={isLoadingUsers}
          textContent={"Loading..."}
          textStyle={styles.spinner}
        />
      ) : (
        search &&
        filteredUsers.length > 0 &&
        !selectedUser && (
          <View style={styles.contentUsername}>
            {filteredUsers.map((user, index) => (
              <TouchableOpacity
                key={index}
                style={styles.listUsername}
                onPress={() => handleClick(user)}
              >
                <Text style={styles.textUsername}>{user?.username}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentInput: {
    width: "90%",
    marginBottom: 10,
    alignSelf: "center",
  },
  searchInput: {
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#808080",
  },
  contentUsername: {
    width: "100%",
    position: "absolute",
    top: 50,
    padding: 10,
    alignSelf: "center",
    borderRadius: 10,
    borderColor: "#808080",
    borderWidth: 1,
    backgroundColor: "#F5F5F5",
    zIndex: 10,
  },
  listUsername: {
    marginBottom: 5,
  },
  textUsername: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#808080",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "transparent",
    borderBottomColor: "#808080",
    borderWidth: 1,
  },
  errorTransfer: {
    width: "100%",
    alignSelf: "center",
    fontSize: 12,
    color: "red",
  },
  spinner: {
    marginTop: -80,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    color: "#808080",
  },
});

export default SearchUsername;
