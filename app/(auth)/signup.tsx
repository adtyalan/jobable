// adtyalan/jobable/jobable-35e9151abcbe5a03d878c7ad16219929d0279287/app/(auth)/signup.tsx

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';

// Tipe untuk peran yang bisa dipilih
type Role = 'pencari_kerja' | 'perusahaan';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // State baru untuk nama lengkap
  const [role, setRole] = useState<Role>('pencari_kerja'); // State baru untuk peran

  const signup = async () => {
    if (!fullName.trim()) {
      return Alert.alert('Pendaftaran Gagal', 'Nama lengkap tidak boleh kosong.');
    }

    // Modifikasi di sini: tambahkan options.data untuk mengirim role dan full_name
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
          full_name: fullName,
        },
      },
    });

    if (error) return Alert.alert('Pendaftaran Gagal', error.message);

    Alert.alert('Berhasil', 'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.centered}>
          <View style={styles.cardLogo}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={{ width: '100%', height: 100, contentFit: 'cover' }}
            />
          </View>
          <View style={styles.card}>
            <Pressable onPress={() => router.replace('/')} style={styles.backBtn}>
              <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: 'https://www.svgrepo.com/show/500472/back.svg' }}
              />
            </Pressable>
            <Text style={styles.title}>Daftar</Text>

            {/* Input Nama Lengkap */}
            <TextInput
              placeholder="Nama Lengkap"
              onChangeText={setFullName}
              value={fullName}
              style={styles.input}
              autoCapitalize="words"
            />

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

            {/* Pilihan Role */}
            <Text style={styles.label}>Saya adalah:</Text>
            <View style={styles.roleSelector}>
              <Pressable
                style={[styles.roleButton, role === 'pencari_kerja' && styles.roleButtonActive]}
                onPress={() => setRole('pencari_kerja')}
              >
                <Text style={[styles.roleText, role === 'pencari_kerja' && styles.roleTextActive]}>
                  Pencari Kerja
                </Text>
              </Pressable>
              <Pressable
                style={[styles.roleButton, role === 'perusahaan' && styles.roleButtonActive]}
                onPress={() => setRole('perusahaan')}
              >
                <Text style={[styles.roleText, role === 'perusahaan' && styles.roleTextActive]}>
                  Perusahaan
                </Text>
              </Pressable>
            </View>

            <Button title="Daftar" onPress={signup} />
            <View style={styles.signupRow}>
              <Text>Sudah punya akun?</Text>
              <Pressable onPress={() => router.replace('/login')}>
                <Text style={styles.signupText}> Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width > 400 ? 380 : width - 40;

// Salin semua style dari bawah ini
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 1,
    alignItems: 'stretch',
  },
  cardLogo: {
    width: CARD_WIDTH,
    padding: 28,
    alignItems: 'stretch',
    marginBottom: 24,
  },
  backBtn: {
    position: 'absolute',
    left: 32,
    top: 42,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 8,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  roleSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  roleButtonActive: {
    backgroundColor: '#00A991', // Biru
  },
  roleText: {
    fontSize: 16,
    color: '#333',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    alignItems: 'center',
  },
  signupText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
