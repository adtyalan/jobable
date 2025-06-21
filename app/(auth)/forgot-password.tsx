import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      Alert.alert("Peringatan", "Email tidak boleh kosong.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:8081/reset-password", // Pastikan ini sesuai dengan scheme kamu
    });

    if (error) {
      Alert.alert("Gagal", error.message);
    } else {
      Alert.alert("Berhasil", "Link reset password telah dikirim ke email Anda.");
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
          <Image
            source={require("../../assets/images/icon.png")}
            style={{ width: 120, height: 120, marginBottom: 16 }}
          />
          <View style={styles.card}>
          <Pressable
            onPress={() => router.replace("/signup")}
            style={styles.backBtn}
          >
          <Image
            style={{ width: 25, height: 25 }}
            source={{ uri: "https://www.svgrepo.com/show/500472/back.svg" }}
          />
          </Pressable>
          <Text style={styles.title}>Lupa Password?</Text>
            <TextInput
              placeholder="Masukkan email Anda"
              onChangeText={setEmail}
              value={email}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSendResetLink}
            >
              <Text style={styles.buttonText}>Kirim Link Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width > 400 ? 380 : width - 40;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f6fa" },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backBtn: {
    position: "absolute",
    left: 32,
    top: 42,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 28,
    marginTop: 8,
    color: "#222"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
