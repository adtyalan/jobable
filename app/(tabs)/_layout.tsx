// File: app/(tabs)/_layout.tsx

import { useUserProfile } from '@/hooks/ProfileContext';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { Image } from 'expo-image';
import { Tabs, router } from 'expo-router';
import { Platform, Pressable, StyleSheet } from 'react-native';
import 'react-native-url-polyfill/auto';

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

function SearchIcon() {
  return (
    <Image style={styles.icon} source={{ uri: 'https://www.svgrepo.com/show/532555/search.svg' }} />
  );
}

export default function JobSeekerLayout() {
  const { profile } = useUserProfile();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerRight: () => <SettingIcon />,
        headerLeft: () => <SearchIcon />,
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: 'white',
        tabBarActiveBackgroundColor: 'transparent',
        tabBarStyle: {
          backgroundColor: '#00A991',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          marginHorizontal: 20,
          marginBottom: Platform.OS === 'web' ? 0 : 15,
          position: 'absolute',
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'web' ? 0 : 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <Octicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: 'Pesan',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Komunitas', // Judul statis untuk layout ini
          tabBarIcon: ({ color }) => <Octicons name="archive" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <FontAwesome6 name="user" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs/[id]"
        options={{
          href: null, // Tidak perlu mengubah URL
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="jobs/form"
        options={{
          href: null, // Tidak perlu mengubah URL
          headerShown: false,
          tabBarStyle: { display: 'none' },
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
});
