// app/(tabs)/profile.tsx
import { router } from 'expo-router';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useUserProfile } from '../../hooks/ProfileContext'; // Ganti hook
import { supabase } from '../../utils/supabase';

export default function ProfilePage() {
  // Gunakan hook baru kita
  const { user, profile, loading } = useUserProfile();

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  if (!user || !profile) {
    return (
      <View style={styles.container}>
        <Text>Silakan login untuk melihat profil Anda.</Text>
        <Button title="Login" onPress={() => router.push('/login')} />
      </View>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/'); // Balik ke home
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.greeting}>Halo, {profile.full_name}!</Text>
        <Text style={styles.email}>Email: {user.email}</Text>
        <Text style={styles.role}>Peran Anda: {profile.role}</Text>

        {/* Contoh Tampilan Kondisional */}
        {profile.role === 'recruiter' && (
          <View style={styles.roleSpecificSection}>
            <Text style={styles.sectionTitle}>Menu Perusahaan</Text>
            <Button
              title="Posting Lowongan Baru"
              onPress={() => {
                /* Navigasi ke halaman posting */
              }}
            />
          </View>
        )}

        {profile.role === 'job_seeker' && (
          <View style={styles.roleSpecificSection}>
            <Text style={styles.sectionTitle}>Menu Pencari Kerja</Text>
            <Button
              title="Lihat Lamaran Saya"
              onPress={() => {
                /* Navigasi ke halaman lamaran */
              }}
            />
          </View>
        )}

        <View style={styles.logoutButton}>
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f6fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  roleSpecificSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 'auto',
    paddingTop: 20,
  },
});
