import { Image } from "expo-image";
import { router, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/supabase";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useGlobalSearchParams();
  const access_token = params?.access_token as string;

  useEffect(() => {
    if (!access_token) {
      Alert.alert("Error", "Token tidak ditemukan di URL.");
    }
  }, [access_token]);

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert("Peringatan", "Password baru tidak boleh kosong.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Peringatan", "Password minimal 6 karakter.");
      return;
    }

    if (!access_token) {
      Alert.alert("Error", "Token reset tidak tersedia.");
      return;
    }

    setLoading(true);

    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token: "",
    });

    if (sessionError) {
      setLoading(false);
      Alert.alert("Gagal", "Token tidak valid atau telah kedaluwarsa.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      Alert.alert("Gagal", error.message);
    } else {
      Alert.alert("Sukses", "Password berhasil diubah.");
      router.replace("/login");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.centered}>
          {/* Logo Jobable */}
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
          />

          {/* Card */}
          <View style={styles.card}>
            {/* Judul dan tombol kembali */}
            <View style={styles.titleRow}>
              <Pressable onPress={() => router.replace("/login")}>
                <Image
                  source={{ uri: "https://www.svgrepo.com/show/500472/back.svg" }}
                  style={styles.backIcon}
                />
              </Pressable>
              <Text style={styles.title}>Reset Password</Text>
            </View>

            <Text style={styles.label}>Password Baru</Text>
            <TextInput
              placeholder="••••••••"
              secureTextEntry
              onChangeText={setNewPassword}
              value={newPassword}
              style={styles.input}
            />

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Menyimpan..." : "Simpan Password Baru"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.backLoginText}>Kembali ke Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  flex: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  backIcon: {
    position:"absolute",
    lemon: 32,
    top : 40,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 18,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backLoginText: {
    textAlign: "center",
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
});
