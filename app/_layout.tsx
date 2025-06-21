// File: app/_layout.tsx

import { ProfileProvider, useUserProfile } from '@/hooks/ProfileContext';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Mencegah splash screen hilang secara otomatis
SplashScreen.preventAutoHideAsync();

function RoleRedirector() {
  const { user, profile, loading } = useUserProfile();
  const segments = useSegments();

  useEffect(() => {
    // JANGAN LAKUKAN APA-APA JIKA:
    // 1. Data masih loading
    // 2. Segments belum siap (array masih kosong)
    if (loading || segments.length === 0) {
      return;
    }

    // ... sisa logika Anda tetap sama ...
    const PUBLIC_ROUTES = ['(tabs)', 'jobs', 'settings', '(auth)', 'auth'];
    const isPublicRoute = PUBLIC_ROUTES.includes(segments[0] as string);
    // ... dst ...
  }, [profile, user, loading, segments]);

  return null;
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
    <ProfileProvider>
      <RoleRedirector />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Layout untuk job seeker & tamu */}
        <Stack.Screen name="(tabs)" />
        {/* Layout untuk recruiter */}
        <Stack.Screen name="(recruiter)" />
        {/* Layout untuk otentikasi */}
        <Stack.Screen name="(auth)" />
        {/* Rute lain seperti 'jobs' dan 'settings' akan ditangani oleh file masing-masing */}
        <Stack.Screen name="settings"></Stack.Screen>
        <Stack.Screen name="jobs"></Stack.Screen>
      </Stack>
    </ProfileProvider>
  );
}
