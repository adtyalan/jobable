// File: app/jobs/[id]/_layout.tsx

import { Stack } from 'expo-router';

export default function JobDetailLayout() {
  // Layout ini akan mengatur semua layar di bawah /jobs/[id]/...
  // Seperti /jobs/123/ dan /jobs/123/form
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Layar 'index' dan 'form' akan otomatis dimasukkan ke dalam Stack ini */}
      <Stack.Screen name="index" />
      <Stack.Screen name="form" />
    </Stack>
  );
}
