import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router"; // <-- GANTI DENGAN '@react-navigation/native' jika perlu
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/supabase"; // Pastikan path ini benar

const PasswordInput = ({
  placeholder,
  iconName,
  value,
  onChangeText,
  isPasswordVisible,
  onToggleVisibility,
}) => (
  <View style={styles.inputContainer}>
    <Ionicons name={iconName} size={20} color="#888" style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!isPasswordVisible}
      autoCapitalize="none"
    />
    <TouchableOpacity onPress={onToggleVisibility}>
      <Ionicons
        name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
        size={22}
        color="#888"
      />
    </TouchableOpacity>
  </View>
);


// --- Komponen Utama Layar Ganti Password ---
export default function ChangePasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // BARU: Gunakan useFocusEffect untuk mereset state saat layar menjadi fokus
  useFocusEffect(
    useCallback(() => {
      // Kode ini akan berjalan setiap kali layar ini ditampilkan/difokuskan
      setError(null);
      setSuccess(null);
      setNewPassword("");
      setConfirmPassword("");

      // Fungsi cleanup (opsional), berjalan saat layar tidak lagi fokus
      return () => {};
    }, [])
  );

  // useEffect lama tetap berguna untuk membersihkan error saat mengetik
  useEffect(() => {
    if (newPassword || confirmPassword) {
      setError(null);
    }
  }, [newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    Keyboard.dismiss();
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      return setError("Semua field wajib diisi.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Password baru dan konfirmasi tidak cocok.");
    }
    if (newPassword.length < 6) {
      return setError("Password minimal harus 6 karakter.");
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
      setSuccess("Password berhasil diperbarui!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header yang sudah disesuaikan */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons name="lock-closed-outline" size={28} color="#333" />
              <Text style={styles.title}>Butuh Password Baru?</Text>
            </View>
            <Text style={styles.subtitle}>
              Demi kenayaman dan keamanan akun Anda, mohon untuk selalu mengingat password akun dan tidak memberitahukan password kepada siapapun.
            </Text>
          </View>

          {/* Input fields langsung di layar, tanpa card */}
          <PasswordInput
            placeholder="Password Baru"
            iconName="key-outline"
            value={newPassword}
            onChangeText={setNewPassword}
            isPasswordVisible={isPasswordVisible}
            onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
          />

          <PasswordInput
            placeholder="Konfirmasi Password Baru"
            iconName="checkmark-circle-outline"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPasswordVisible={isConfirmPasswordVisible}
            onToggleVisibility={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}
          {success && <Text style={styles.successText}>{success}</Text>}
        </ScrollView>

        {/* Tombol diletakkan di luar ScrollView agar posisinya tetap di bawah */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Stylesheet tidak ada perubahan
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FC",
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 15,
    color: '#667',
    marginTop: 12,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 12,
    marginBottom: 20, // Diubah dari 10 menjadi 20 agar ada jarak
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 15,
  },
  successText: {
    color: '#388E3C',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  submitButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#00A991',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#00A991',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#A9C6E8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});