import Swiper from "react-native-swiper";
import { StyleSheet, View, Image } from "react-native";

function DisplaySwiper() {
  return (
    <View style={styles.contentSwiper}>
      <Swiper
        style={styles.wrapper}
        showsButtons={true}
        showsPagination={true}
        buttonWrapperStyle={styles.btnWrapper}
        paginationStyle={styles.pagination}
      >
        <View style={styles.slide}>
          <Image
            source={require("../../assets/telkom.png")}
            alt="telkom"
            style={styles.imgSwiper}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require("../../assets/indosat.png")}
            alt="indosat"
            style={styles.imgSwiper}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require("../../assets/xl.png")}
            alt="xl"
            style={styles.imgSwiper}
          />
        </View>
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  contentSwiper: {
    width: "100%",
    height: 200,
    marginBottom: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btnWrapper: {
    height: 175,
    display: "flex",
    alignItems: "center",
  },
  pagination: {
    position: "absolute",
    bottom: 5,
  },
  slide: {
    width: "85%",
    height: 175,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 10,
    elevation: 4,
    shadowOpacity: 0.75,
    shadowRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  imgSwiper: {
    width: "100%",
    height: "100%",
    margin: 0,
    borderRadius: 10,
  },
});

export default DisplaySwiper;
