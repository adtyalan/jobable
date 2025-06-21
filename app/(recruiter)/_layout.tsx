// File: app/(recruiter)/_layout.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { Tabs, router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

function SettingIcon() {
  return (
    <Pressable onPress={() => router.push('/settings')}>
      <Image
        style={styles.icon}
        source={{ uri: 'https://www.svgrepo.com/show/500685/setting.svg' }}
      />
    </Pressable>
  );
}

export default function RecruiterLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: 'Perusahaan',
        headerStyle: {
          backgroundColor: 'white',
        },
        headerRight: () => <SettingIcon />,
        tabBarActiveTintColor: '#007AFF', // Warna biru untuk recruiter
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingTop: 5,
          borderTopColor: '#eee',
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index" // Anda perlu membuat file app/(recruiter)/dashboard.tsx
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="applications" // Anda perlu membuat file app/(recruiter)/applicants.tsx
        options={{
          title: 'Pelamar',
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile" // Anda perlu membuat file app/(recruiter)/company-profile.tsx
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Ionicons name="business-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
    marginHorizontal: 20,
  },
  postJobButton: {
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20, // Angkat tombol ke atas
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
