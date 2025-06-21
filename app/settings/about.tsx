import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Komponen Utama Layar Tentang ---
export default function AboutScreen() {
  // Fungsi untuk menangani navigasi kembali ke layar sebelumnya
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Konten sekarang menjadi anak langsung dari SafeAreaView.
        Tidak ada lagi <View style={styles.contentContainer}>
      */}
      <Text style={styles.appName}>Job.Able: Job Finder Difable</Text>
      <Text style={styles.versionText}>Version 1.0</Text>

      {/* Logo Aplikasi */}
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.logo}
      />

      <Text style={styles.copyrightText}>© 2025–2045 Job.Able Inc.</Text>

      {/* Card Lisensi (elemen non-interaktif) */}
      <View style={styles.licenseCard}>
        <Text style={styles.licenseCardText}>Lisensi</Text>
      </View>
    </SafeAreaView>
  );
}

// --- StyleSheet yang Telah Dimodifikasi ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // Gaya dari contentContainer dipindahkan ke sini
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  // 'contentContainer' tidak lagi diperlukan dan bisa dihapus
  // contentContainer: { ... }, 
  backButton: {
    padding: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A4A4A",
  },
  versionText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  logo: {
    width: 300,
    height: 200,
    resizeMode: "contain",
  },
  copyrightText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 25,
  },
  licenseCard: {
    backgroundColor: "#22C5A3",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  licenseCardText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});