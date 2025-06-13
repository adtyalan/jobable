import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { supabase } from "../../utils/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return Alert.alert("Signup gagal", error.message);
    Alert.alert("Berhasil", "Silakan cek email untuk verifikasi");
    router.replace("/login");
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Daftar" onPress={signup} />
    </View>
  );
}
