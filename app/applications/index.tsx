import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
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
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Ajukan Lamaran</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.groupJob}>
            <TouchableOpacity
              style={styles.jobContainer}
              onPress={() => router.push("/applications/progress")}
            >
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 16,
  },
});
