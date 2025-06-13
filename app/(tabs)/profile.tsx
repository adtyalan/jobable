import { router } from "expo-router";
import { Button, Text, View } from "react-native";
import { useSupabaseUser } from "../../hooks/useSupabaseUser";
import { supabase } from "../../utils/supabase";

export default function ApplicationsPage() {
  const user = useSupabaseUser();

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Silakan login untuk melihat aplikasi kamu.</Text>
        <Button title="Login" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Halo {user.email}, ini daftar aplikasimu 🎉</Text>
      <Button
        title="Logout"
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace("/"); // balik ke home
        }}
      />
    </View>
  );
}
