import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return Alert.alert("Signup gagal", error.message);
    Alert.alert("Berhasil", "Silakan cek email untuk verifikasi");
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.centered}>
          <View style={styles.cardLogo}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={{ width: "100%", height: 100 }}
            />
          </View>
          <View style={styles.card}>
            <Pressable
              onPress={() => router.replace("/")}
              style={styles.backBtn}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: "https://www.svgrepo.com/show/500472/back.svg" }}
              />
            </Pressable>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              style={styles.input}
            />
            <Button title="Daftar" onPress={signup} />
            <View style={styles.signupRow}>
              <Text>Have an account?</Text>
              <Pressable onPress={() => router.replace("/login")}>
                <Text style={styles.signupText}> Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width > 400 ? 380 : width - 40;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 6,
    alignItems: "stretch",
  },
  cardLogo: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 6,
    alignItems: "stretch",
    marginBottom: 24,
  },
  backBtn: {
    position: "absolute",
    left: 18,
    top: 18,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 28,
    marginTop: 8,
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
    alignItems: "center",
  },
  signupText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
