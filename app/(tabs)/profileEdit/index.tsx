import { useUserProfile } from "@/hooks/ProfileContext"; // Sesuaikan path
import { supabase } from "@/utils/supabase"; // Sesuaikan path
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

function dataURIToBlob(dataURI: string): Blob {
  const splitDataURI = dataURI.split(",");
  const byteString = atob(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

const disabilityItems = [
  { label: "Tunanetra", value: "tunanetra" },
  { label: "Tunarungu", value: "tunarungu" },
  { label: "Tunadaksa", value: "tunadaksa" },
  { label: "Tunawicara", value: "tunawicara" },
];

export default function Aplication() {
  const {
    profile,
    user,
    loading: profileLoading,
    fetchProfile,
  } = useUserProfile();
  const [fullName, setFullName] = useState("");
  const [disability, setDisability] = useState("");
  const [biography, setBiography] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar || "");
      setBiography(profile.job_seeker_users?.[0]?.biography || "");
      setDisability(profile.job_seeker_users?.[0]?.disability || "");
    }
  }, [profile]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setAvatarUrl(image.uri); // Tampilkan preview gambar yang baru dipilih
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    console.log("Proses penyimpanan dimulai...");

    try {
      let avatarToUpdate = profile?.avatar;

      // Cek apakah ada gambar baru yang dipilih
      if (avatarUrl && avatarUrl !== profile?.avatar) {
        console.log(
          "Gambar baru terdeteksi, memproses URI:",
          avatarUrl.substring(0, 30) + "..."
        );

        let blob: Blob;
        const fileExt = avatarUrl.includes("data:image")
          ? avatarUrl.split(";")[0].split("/")[1]
          : avatarUrl.split(".").pop()?.toLowerCase() || "jpg";
        const contentType = `image/${fileExt}`;

        // =================================================================
        // ====> PERUBAHAN UTAMA: Membedakan proses untuk Web & Mobile <====
        // =================================================================
        if (avatarUrl.startsWith("data:image")) {
          // Platform WEB: Gunakan fungsi helper baru
          console.log(
            "Mendeteksi format Base64 (web). Mengonversi ke Blob secara manual..."
          );
          blob = dataURIToBlob(avatarUrl);
        } else {
          // Platform MOBILE: Tetap gunakan fetch
          console.log(
            "Mendeteksi format file URI (mobile). Menggunakan fetch..."
          );
          const response = await fetch(avatarUrl);
          blob = await response.blob();
        }

        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        console.log("Mengunggah blob ke path:", filePath);

        const { error: uploadError } = await supabase.storage
          .from("user.avatar")
          .upload(filePath, blob, {
            cacheControl: "3600",
            upsert: true,
            contentType: contentType,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("user.avatar")
          .getPublicUrl(filePath);

        avatarToUpdate = publicUrlData.publicUrl;
        console.log("Upload berhasil, URL baru:", avatarToUpdate);
      } else {
        console.log("Tidak ada gambar baru yang di-upload.");
      }

      // ... sisa kode untuk update database (tidak ada perubahan) ...
      console.log("Memperbarui data di database...");
      await supabase
        .from("users")
        .update({ full_name: fullName, avatar: avatarToUpdate })
        .eq("id", user.id);

      await supabase
        .from("job_seeker_users")
        .update({ biography: biography, disability: disability })
        .eq("user_id", user.id);

      Alert.alert("Sukses", "Profil berhasil diperbarui.");
      fetchProfile();
      router.back();
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error);
      Alert.alert("Gagal", "Tidak dapat menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (profileLoading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profil</Text>
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatarUrl || "https://via.placeholder.com/100" }}
            style={styles.avatar}
          />
          <TouchableOpacity onPress={handlePickImage}>
            <Text style={styles.changeAvatarText}>Ubah Foto Profil</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Status Disabilitas</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value: string | null) => setDisability(value || "")}
            items={disabilityItems}
            style={pickerSelectStyles} // Style ini akan kita ubah di langkah berikutnya
            value={disability}
            placeholder={{ label: "Pilih status disabilitas...", value: null }}
          />
        </View>

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={biography}
          onChangeText={setBiography}
          multiline
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBEA",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E0E0E0",
    marginBottom: 12,
  },
  changeAvatarText: {
    color: "#00B388",
    fontWeight: "600",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A0A0A0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A0A0A0",
    borderRadius: 8,
    justifyContent: "center",
    paddingRight: 14,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#00B388",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

const basePickerInputStyle = {
  fontSize: 16,
  paddingVertical: 12,
  paddingHorizontal: 14,
  color: "black",
  backgroundColor: "transparent",
  borderWidth: 0,
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    ...basePickerInputStyle,
  },
  inputAndroid: {
    ...basePickerInputStyle,
  },
  inputWeb: {
    ...basePickerInputStyle,
    outline: "none",
  },
  placeholder: {
    color: "#A9A9A9",
  },
  iconContainer: {
    top: "50%",
    marginTop: -8,
    right: 15,
  },
});
