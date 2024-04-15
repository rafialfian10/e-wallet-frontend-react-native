import { useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";

import DisplayProfile from "../Components/displayProfile";
import DisplaySaldo from "../Components/displaySaldo";
import DisplayTransaction from "../Components/displayTransaction";
import DisplayCategory from "../Components/displayCategory";
import DisplaySwiper from "../Components/displaySwiper";
import ModalTransactionSuccess from "../Components/modalTransactionSuccess";
import RefreshPage from "../Components/refreshPage";
import { GetUser } from "../Components/Common/Hooks/getUser";

const Home = ({ navigation }) => {
  const { user, refetchUser } = GetUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTopupSuccess, setModalTopupSuccess] = useState(false);
  const [dataTopupSuccess, setDataTopupSuccess] = useState({
    visible: false,
    data: {},
  });

  const handleRefresh = () => {
    refetchUser();
  };

  return (
    <SafeAreaView style={styles.containerHome}>
      <RefreshPage pageStyle={""} onRefresh={handleRefresh}>
        <View>
          <View style={styles.containerProfile}>
            <DisplayProfile navigation={navigation} />
            <DisplaySaldo user={user} />
            <DisplayTransaction navigation={navigation} />
          </View>
          <View style={styles.containerCategory}>
            <DisplayCategory />
          </View>
          <View style={styles.containerSwiper}>
            <DisplaySwiper />
          </View>
        </View>
      </RefreshPage>
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
      <RefreshPage onRefresh={handleRefresh} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  camera: {
    flex: 1,
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
