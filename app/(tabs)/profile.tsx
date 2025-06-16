import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSupabaseUser } from "../../hooks/useSupabaseUser";
import { supabase } from "../../utils/supabase";

const categories = ["Tentang", "Pengalaman", "Pendidikan", "Keahlian"];
const accessibilityList = [
  "Saya menggunakan NVDA sebagai screen reader.",
  "Saya lebih nyaman bekerja dari rumah dan berkomunikasi lewat audio call.",
  "Memerlukan pendamping saat orientasi pertama di kantor.",
];

export default function ApplicationsPage() {
  const user = useSupabaseUser();
  const [selectedCategory, setSelectedCategory] = useState("Tentang");
  const { width } = useWindowDimensions();
  const desktopBreakpoint = 768; // Breakpoint bisa disesuaikan
  const isDesktop = width >= desktopBreakpoint;

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Silakan login untuk melihat aplikasi kamu.</Text>
        <Button title="Login" onPress={() => router.push("/login")} />
      </View>
    );
  }

  const renderCategoryButtons = () => {
    return categories.map((item) => (
      <TouchableOpacity
        key={item}
        onPress={() => setSelectedCategory(item)}
        // Perubahan 4: Menerapkan style desktop secara kondisional
        style={[
          styles.categoryButton,
          selectedCategory === item && styles.categoryButtonSelected,
          isDesktop && styles.desktopCategoryButton, // Style ini hanya aktif jika isDesktop true
        ]}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === item && styles.categoryTextSelected,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {item}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.profileCircle}>
            <View style={styles.difableContainer}>
              <Text style={styles.difableText}>Tunanetra</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.nameText}>Muhammad Abyan Aditya</Text>
          <View style={styles.containerNameFollow}>
            <Text style={styles.followText}>259{"\u2028"}koneksi</Text>
            <Text style={styles.rotatedline} />
            <Text style={styles.followText}>469{"\u2028"}pengikut</Text>
          </View>

          <Text style={styles.progressHeading}>Pantau Lamaran</Text>
          <TouchableOpacity style={styles.progressButton}>
            <View style={styles.leftGroup}>
              <View style={styles.progressCircle} />
              <View style={styles.progressTextGroup}>
                <Text style={styles.progressJobText}>Web Developer</Text>
                <Text style={styles.progressText}>Review CV</Text>
              </View>
            </View>
          </TouchableOpacity>

          {isDesktop ? (
            // Layout untuk Desktop
            <View style={styles.desktopCategoryContainer}>
              {renderCategoryButtons()}
            </View>
          ) : (
            // Layout untuk Mobile (kode asli Anda)
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 16 }}
            >
              {renderCategoryButtons()}
            </ScrollView>
          )}

          <View style={styles.containerContent}>
            <Text style={styles.headingContent}>Aksesibilitas</Text>
            {accessibilityList.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>{"\u2022"}</Text>
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={{ padding: 20 }}>
            <Text>Halo {user.email}, ini daftar aplikasimu 🎉</Text>
            <Button
              title="Logout"
              onPress={async () => {
                await supabase.auth.signOut();
                router.replace("/"); // balik ke home
              }}
            />
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
    // alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    // justifyContent: 'center',
  },

  profileCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: "#00A991",
    backgroundColor: "#d9d9d9",
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 8,
  },

  difableContainer: {
    position: "absolute",
    bottom: -10,
    backgroundColor: "#00A991",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 80,
    alignItems: "center",
    alignSelf: "center",
  },

  difableText: {
    color: "#FBFFE4",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },

  containerNameFollow: {
    flexDirection: "row", // inline-flex jadi row
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    position: "relative",
  },

  nameText: {
    height: 24,
    fontSize: 16,
    color: "#262626",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 10,
  },

  rotatedline: {
    width: 36,
    height: 2,
    borderColor: "#00A991",
    borderWidth: 2,
    marginHorizontal: 11,
    transform: [{ rotate: "90deg" }],
  },

  followText: {
    height: 36,
    width: 60,
    fontSize: 12,
    color: "#262626",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    lineHeight: 18,
    flexShrink: 1,
  },

  progressHeading: {
    marginTop: 21,
    marginBottom: 6,
    width: 390,
    height: 22,
    fontSize: 16,
    fontWeight: 600,
    color: "#262626",
    textAlign: "left",
  },

  progressButton: {
    marginBottom: 16,
    width: "100%",
    height: 61,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 9,
    paddingVertical: 8,

    backgroundColor: "#00A991",
    borderRadius: 18,
  },

  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#d9d9d9",
    marginRight: 13,
  },

  progressTextGroup: {
    marginRight: 176,
  },

  progressJobText: {
    fontSize: 14,
    color: "#262626",
  },

  progressText: {
    fontSize: 12,
    color: "#FBFFE4",
  },

  categoryButton: {
    paddingBottom: 4,
    flexGrow: 1,
    paddingTop: 2,
    width: "auto",
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#00A991", // emerald-500
    marginRight: 10,
    marginBottom: 8,
    backgroundColor: "#FBFFE4",
  },

  categoryText: {
    width: "auto",
    color: "#00A991",
    fontSize: 14,
    alignSelf: "center",
    paddingHorizontal: 22,
    textAlign: "center",
  },

  categoryButtonSelected: {
    backgroundColor: "#00A991",
  },

  categoryTextSelected: {
    color: "#FBFFE4",
  },

  containerContent: {
    marginTop: 0,
    width: "100%",
    height: "auto",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#00A991",
    borderRadius: 15,
  },

  headingContent: {
    fontSize: 16,
    fontWeight: 700,
    color: "#262626",
    marginBottom: 6,
  },

  textContent: {
    fontSize: 13,
    color: "#FBFFE4",
  },

  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  bullet: {
    color: "#FBFFE4",
    fontSize: 16,
    lineHeight: 20,
    marginRight: 6,
  },

  listItemText: {
    flex: 1,
    color: "#FBFFE4",
    fontSize: 13,
    lineHeight: 20,
  },

  // avatar: {
  //   width: 150,
  //   height: 150,
  //   borderRadius: 75,
  //   marginTop: 16,
  // },

  desktopCategoryContainer: {
    flexDirection: "row", // Membuat item di dalamnya berjejer horizontal
    width: "100%", // Memastikan container memakai lebar penuh
    marginBottom: 16,
    gap: 10, // Alternatif modern untuk marginRight, jika tidak ingin pakai gap, hapus ini
  },
  desktopCategoryButton: {
    flex: 1, // KUNCI UTAMA: membuat setiap tombol memanjang mengisi ruang yg tersedia
    marginRight: 0, // Jika pakai 'gap', nonaktifkan marginRight agar jarak rata sempurna
  },
});
