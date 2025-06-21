import { Image } from 'expo-image';
import { Tabs, router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

function BackIcon() {
  return (
    <Pressable onPress={() => router.back()}>
      <Image style={styles.icon} source={{ uri: 'https://www.svgrepo.com/show/500472/back.svg' }} />
    </Pressable>
  );
}

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        title: 'Settings',
        tabBarActiveTintColor: 'black',
        headerStyle: {
          backgroundColor: 'white',
        },
        headerLeft: () => <BackIcon />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          title: 'Pengaturan',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          title: 'Notifikasi',
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null,
          title: 'Ganti Password',
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          href: null,
          title: 'Tentang',
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
