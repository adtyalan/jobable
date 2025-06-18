import { router } from "expo-router";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
// import useSupabaseUser atau context user kamu
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSupabaseUser } from "../../hooks/useSupabaseUser";
import { supabase } from "../../utils/supabase";

export default function Settings() {
  const user = useSupabaseUser();
  const [modalVisible, setModalVisible] = useState(false);

  const handleProtectedPress = (callback: () => void) => {
    if (!user) {
      setModalVisible(true);
    } else {
      callback();
    }
  };

  const handleLoginLogout = async () => {
    if (!user) {
      router.push("/login");
    } else {
      await supabase.auth.signOut();
      router.replace("/");
    }
  };

  const settings = [
    {
      icon: <Ionicons name="notifications-outline" size={24} color="black" />,
      label: "Notifikasi",
      onPress: () => router.push("/settings/notifications"),
    },
    {
      icon: <MaterialIcons name="password" size={24} color="black" />,
      label: "Ganti Password",
      onPress: () =>
        handleProtectedPress(() => router.push("/settings/change-password")),
    },
    {
      icon: <Ionicons name="information-outline" size={24} color="black" />,
      label: "Tentang Aplikasi",
      onPress: () => router.push("/settings/about"),
    },
    /// Selalu tampilkan menu Masuk, warna icon tergantung status login
    {
      icon: (
        <MaterialIcons
          name="login"
          size={24}
          color={user ? "red" : "black"}
          style={{
            borderRadius: 6,
            padding: user ? 2 : 0,
          }}
        />
      ),
      label: user ? "Keluar" : "Masuk",
      onPress: handleLoginLogout,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {settings.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          activeOpacity={0.8}
          style={styles.card}
          onPress={item.onPress}
        >
          {item.icon}
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text
              style={{ fontSize: 18, marginBottom: 16, textAlign: "center" }}
            >
              Anda harus login untuk mengakses menu ini.
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                setModalVisible(false);
                router.push("/login");
              }}
            >
              <Text style={styles.primaryBtnText}>Login Sekarang</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.secondaryBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f6fa",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 18,
    color: "#222",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    width: 300,
    alignItems: "center",
    elevation: 8,
  },
  primaryBtn: {
    backgroundColor: "#2563eb", // Tailwind blue-600
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    backgroundColor: "#f1f5f9", // Tailwind slate-100
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#334155", // Tailwind slate-700
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
