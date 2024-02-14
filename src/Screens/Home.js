import { useState } from "react";
import { StyleSheet, SafeAreaView, ScrollView, View } from "react-native";

import DisplayProfile from "../Components/displayProfile";
import DisplaySaldo from "../Components/displaySaldo";
import DisplayTransaction from "../Components/displayTransaction";
import DisplayCategory from "../Components/displayCategory";
import DisplaySwiper from "../Components/displaySwiper";
import ModalTransactionSuccess from "../Components/modalTransactionSuccess";

const Home = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTopupSuccess, setModalTopupSuccess] = useState(false);
  const [dataTopupSuccess, setDataTopupSuccess] = useState({
    visible: false,
    data: {},
  });

  return (
    <SafeAreaView style={styles.containerHome}>
      <ScrollView>
        <View>
          <View style={styles.containerProfile}>
            <DisplayProfile navigation={navigation} />
            <DisplaySaldo />
            <DisplayTransaction navigation={navigation} />
          </View>
        </View>
        <View style={styles.containerCategory}>
          <DisplayCategory />
        </View>
        <View style={styles.containerSwiper}>
          <DisplaySwiper />
        </View>
      </ScrollView>
      {modalTopupSuccess && (
        <ModalTransactionSuccess
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalTransactionSuccess={modalTopupSuccess}
          setModalTransactionSuccess={setModalTopupSuccess}
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
