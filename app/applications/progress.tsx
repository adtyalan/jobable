import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import ProgressTracker from "./components/timeline"; // 1. Impor komponen

export default function Applications() {
  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        {/* Bagian Atas: Info Pekerjaan (Tidak Berubah) */}
        <View style={styles.jobContainer}>
          <View style={styles.groupAll}>
            <View style={styles.logoContainer}>
              <Text style={{ fontSize: 40 }}>🫦</Text>
            </View>
            <View style={styles.groupText}>
              <Text style={styles.textCompany}>
                PT Telkom Indonesia ● Surabaya, Jawa Timur
              </Text>
              <Text style={styles.textJob}>Web Developer</Text>
            </View>
          </View>
        </View>

        {/* Bagian Bawah: Status Lamaran */}
        <View style={styles.statusContainer}>
          <Text style={{ fontSize: 14 }}>Status</Text>
          <Text style={{ fontSize: 19, fontWeight: "600", marginBottom: 10 }}>
            Web Developer
          </Text>
          <View style={{ height: 0.5, borderWidth: 0.5, marginBottom: 10 }} />

          {/* 2. Gunakan ScrollView dan letakkan ProgressTracker di sini */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <ProgressTracker />
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  // ... semua style lama Anda tetap di sini ...
  mainContainer: {
    flex: 1,
    backgroundColor: "#FBFFE4",
  },
  jobContainer: {
    height: "auto",
    paddingHorizontal: 25,
    paddingVertical: 25,
    backgroundColor: "#00A991",
    borderRadius: 20,
    marginVertical: 20,
    marginHorizontal: 20,
    alignContent: "center",
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
  groupText: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  statusContainer: {
    flex: 1, // Penting agar container ini mengisi sisa layar
    backgroundColor: "#B0E4DD",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
