import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Applications() {
  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.groupJob}>
            <TouchableOpacity style={styles.jobContainer}>
              <View style={styles.groupAll}>
                <View style={styles.logoContainer}>
                  <Text style={{ fontSize: 40 }}>🫦</Text>
                </View>
                <View style={styles.groupText}>
                  <Text style={styles.textCompany}>
                    PT Telkom Indonesia ● Surabaya, Jawa Timur
                  </Text>
                  <Text style={styles.textJob}>Web Developer</Text>
                  <View style={styles.groupProgress}>
                    <MaterialCommunityIcons
                      name="record-circle-outline"
                      size={15}
                      color="#d9d9d9"
                    />
                    <Text style={styles.textProgress}>Unggah Dokumen</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FBFFE4",
  },

  groupJob: {
    gap: 10,
    marginVertical: 20,
    marginHorizontal: 20,
  },

  jobContainer: {
    width: "100%",
    height: "auto",
    paddingHorizontal: 25,
    paddingVertical: 25,
    backgroundColor: "#00A991",
    borderRadius: 20,
  },

  logoContainer: {
    height: 90,
    width: 90,
    borderRadius: 45,
    backgroundColor: "#394945",
    justifyContent: "center",
    alignItems: "center",
  },

  groupAll: {
    flexDirection: "row",
    gap: 31,
    justifyContent: "flex-start",
  },

  textCompany: {
    color: "#394945",
    fontSize: 8,
    fontWeight: 600,
  },

  textJob: {
    fontSize: 24,
    color: "#FBFFE4",
    fontWeight: "600",
    marginBottom: 10,
  },

  textProgress: {
    fontSize: 11,
    color: "#d9d9d9",
    fontWeight: "700",
  },

  groupText: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  groupProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
});
