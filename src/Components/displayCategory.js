import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function DisplayCategory() {
  return (
    <ScrollView style={styles.contentCategory}>
      <View style={styles.subContentCategory}>
        <TouchableOpacity style={styles.listCategory}>
          <Image
            source={require("../../assets/listrik.png")}
            alt="listrik"
            style={styles.imgListCategory}
          />
          <Text style={styles.textListCategory}>Listrik</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listCategory}>
          <Image
            source={require("../../assets/telepon.png")}
            alt="telepon"
            style={styles.imgListCategory}
          />
          <Text style={styles.textListCategory}>Telepon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listCategory}>
          <Image
            source={require("../../assets/pulsa.png")}
            alt="pulsa"
            style={styles.imgListCategory}
          />
          <Text style={styles.textListCategory}>Pulsa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listCategory}>
          <Image
            source={require("../../assets/game.png")}
            alt="game"
            style={styles.imgListCategory}
          />
          <Text style={styles.textListCategory}>Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listCategory}>
          <Image
            source={require("../../assets/asuransi.png")}
            alt="asuransi"
            style={styles.imgListCategory}
          />
          <Text style={styles.textListCategory}>Asuransi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listCategory}>
          <Image
            source={require("../../assets/donasi.png")}
            alt="donasi"
            style={styles.imgListCategory}
          />
          <Text style={styles.textListCategory}>Donasi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listCategory}>
          <Image
            source={require("../../assets/bpjs.png")}
            alt="bpjs"
            style={styles.imgListCategory}
          />
          <Text style={styles.textListCategory}>BPJS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listCategory}>
          <Image
            source={require("../../assets/other.png")}
            alt="other"
            style={styles.imgListCategory}
          />
          <Text style={styles.textListCategory}>Lainnya</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentCategory: {
    width: "90%",
    alignSelf: "center",
  },
  subContentCategory: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    flexWrap: "wrap",
  },
  listCategory: {
    width: 60,
    height: 60,
    margin: 7.5,
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    elevation: 5,
    shadowOpacity: 0.75,
    shadowRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  imgListCategory: {
    width: 25,
    height: 25,
  },
  textListCategory: {
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 10,
    color: "#000000",
  },
});

export default DisplayCategory;
