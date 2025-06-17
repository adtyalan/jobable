import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { Image } from "expo-image";
import { Tabs, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import "react-native-url-polyfill/auto";
import { ProfileProvider, useUserProfile } from "../../hooks/ProfileContext";

SplashScreen.preventAutoHideAsync();

function SettingIcon() {
  return (
    <Pressable onPress={() => router.push("/settings")}>
      <Image
        style={styles.icon}
        source={{ uri: "https://www.svgrepo.com/show/500685/setting.svg" }}
      />
    </Pressable>
  );
}

function SearchIcon() {
  return (
    <Image
      style={styles.icon}
      source={{ uri: "https://www.svgrepo.com/show/532555/search.svg" }}
    />
  );
}

export default function RootLayout() {
  // Jangan panggil useUserProfile di sini!
  const [loaded, error] = useFonts({
    Inter_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  // Bungkus semua dengan ProfileProvider
  return (
    <ProfileProvider>
      <InnerTabs />
    </ProfileProvider>
  );
}

// Komponen baru untuk Tabs dan pemanggilan useUserProfile
function InnerTabs() {
  const { profile } = useUserProfile();

  return (
    // ...existing code...
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "white",
        },
        headerRight: () => <SettingIcon />,
        headerLeft: () => <SearchIcon />,
        tabBarInactiveTintColor: "black",
        tabBarActiveTintColor: "white",
        tabBarActiveBackgroundColor: "transparent",
        tabBarStyle: {
          backgroundColor: "#00A991",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          marginHorizontal: 20,
          marginBottom: Platform.OS === "web" ? 0 : 15,
          position: "absolute",
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === "web" ? 0 : 5,
        },
        // perlu konfigurasi untuk web style
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <Octicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Pesan",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title:
            profile?.role === "recruiter"
              ? "Kandidat"
              : profile?.role === "job_seeker"
              ? "Komunitas"
              : "Komunitas",
          tabBarIcon: ({ color }) => (
            <Octicons name="archive" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
    // ...existing code...
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
    marginHorizontal: 20,
  },
});
