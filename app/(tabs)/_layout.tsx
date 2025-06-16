import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { Tabs, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import "react-native-url-polyfill/auto";

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

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        headerStyle: {
          backgroundColor: "  white",
        },
        headerRight: () => <SettingIcon />,
        headerLeft: () => <SearchIcon />,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Beranda" }} />
      <Tabs.Screen name="message" options={{ title: "Pesan" }} />
      <Tabs.Screen name="community" options={{ title: "Komunitas" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
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
