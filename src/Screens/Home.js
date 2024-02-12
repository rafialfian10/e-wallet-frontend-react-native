import { useState, useContext } from "react";
import { StyleSheet, SafeAreaView, ScrollView, View } from "react-native";

import DisplayProfile from "../Components/displayProfile";
import DisplaySaldo from "../Components/displaySaldo";
import DisplayTransaction from "../Components/displayTransaction";
import DisplayCategory from "../Components/displayCategory";
import DisplaySwiper from "../Components/displaySwiper";
import ModalTopup from "../Components/modalTopup";
import ModalTransactionSuccess from "../Components/modalTransactionSuccess";
import { UserContext } from "../Context/UserContext";

const Home = ({ navigation }) => {
  const [state, dispatch] = useContext(UserContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTopupSuccess, setModalTopupSuccess] = useState(false);
  const [dataTopupSuccess, setDataTopupSuccess] = useState({
    visible: false,
    data: {},
  });

  const handleTopupSuccess = (data) => {
    setModalTopupSuccess(true);
    setDataTopupSuccess({ visible: true, data });
  };

  return (
    <SafeAreaView style={styles.containerHome}>
      <ScrollView>
        <View>
          <View style={styles.containerProfile}>
            <DisplayProfile navigation={navigation} />
            <DisplaySaldo />
            <DisplayTransaction
              navigation={navigation}
              setModalVisible={setModalVisible}
            />
          </View>
        </View>
        <View style={styles.containerCategory}>
          <DisplayCategory />
        </View>
        <View style={styles.containerSwiper}>
          <DisplaySwiper />
        </View>
      </ScrollView>
      {modalVisible && (
        <ModalTopup
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          handleTopupSuccess={handleTopupSuccess}
        />
      )}
      {modalTopupSuccess && (
        <ModalTransactionSuccess
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalTopupSuccess={modalTopupSuccess}
          setModalTopupSuccess={setModalTopupSuccess}
          dataTransactionSuccess={dataTopupSuccess}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  containerProfile: {
    width: "100%",
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 20,
  },
  subContentProfile: {
    display: "flex",
    justifyContent: "center",
    height: 80,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  containerCategory: {
    width: "100%",
    marginBottom: 30,
  },
  containerSwiper: {
    width: "100%",
  },
});

export default Home;
