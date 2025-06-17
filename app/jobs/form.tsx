import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/supabase";

const ApplicationForm = () => {
  const [selectedSection, setSelectedSection] = useState("Pengalaman");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resume, setResume] = useState(null);

  const { id } = useLocalSearchParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
    async function fetchJob() {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*, companies(*)")
        .eq("id", id)
        .single();
      if (!error) setJob(data);
      setLoading(false);
    }
  }, [id]);

  // Fungsi untuk memilih file
  const pickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (
      result.type === "success" &&
      result.assets &&
      result.assets.length > 0
    ) {
      setResume(result.assets[0]);
      console.log("Resume terpilih:", result.assets[0]);
    }
  };

  // Form validation
  function validate() {
    if (!name.trim() || !address.trim() || !phone.trim() || !email.trim()) {
      setError("Semua field wajib diisi.");
      return false;
    }
    if (!/^[0-9]+$/.test(phone)) {
      setError("Nomor telepon hanya boleh angka.");
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError("Format email tidak valid.");
      return false;
    }
    setError(null);
    return true;
  }

  // Submit handler
  async function handleSubmit() {
    Keyboard.dismiss();
    setSuccess(null);
    if (!validate()) return;

    const { error: insertError } = await supabase.from("applications").insert([
      {
        job_id: job?.id,
        company_id: job?.companies?.id,
        name,
        address,
        phone,
        email,
        section: selectedSection,
      },
    ]);
    if (insertError) {
      setError("Gagal mengirim lamaran. Silakan coba lagi.");
    } else {
      setSuccess("Lamaran berhasil dikirim!");
      setName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setSelectedSection("Pengalaman");
      setError(null);
      setTimeout(() => {
        router.replace("/"); // Kembali ke halaman utama setelah submit
      }, 1500);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.title}>Ajukan Lamaran</Text>
            </View>

            {/* Job Info */}
            <View style={styles.jobCard}>
              <View style={styles.logo}>
                {job?.companies?.logo ? (
                  <Image
                    source={{ uri: job.companies.logo }}
                    style={{ width: 40, height: 40, borderRadius: 8 }}
                    contentFit="contain"
                  />
                ) : (
                  <Text style={styles.logoIcon}>🔥</Text>
                )}
              </View>
              <View>
                <Text style={styles.jobTitle}>{job?.title || "-"}</Text>
                <Text style={styles.companyInfo}>
                  {job?.companies?.company_name || "-"} • {job?.location || "-"}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push(`/jobs/${job?.id}`)}
                >
                  <Text style={styles.detailLink}>Lihat detail pekerjaan</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form */}
            <Text style={styles.label}>Nama</Text>
            <TextInput
              style={[styles.input, { borderColor: "#737373" }]}
              placeholderTextColor="#999"
              placeholder="Contoh: Muhammad Abyan Aditya"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Alamat Rumah</Text>
            <TextInput
              style={[styles.input, { borderColor: "#737373" }]}
              placeholder="Contoh: Sekaran, Gunungpati, Semarang"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Nomor Telepon</Text>
            <View style={styles.phoneRow}>
              <TextInput
                style={[styles.codeInput, { borderColor: "#737373" }]}
                value="+62"
                editable={false}
              />
              <TextInput
                style={[styles.phoneInput, { borderColor: "#737373" }]}
                placeholder="Contoh: 81575624991"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.label}>Alamat Email</Text>
            <TextInput
              style={[styles.input, { borderColor: "#737373" }]}
              placeholder="Contoh: kamu@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Resume</Text>
            <TouchableOpacity
              style={[
                styles.uploadButton,
                resume && {
                  backgroundColor: "#00B388",
                  borderColor: "#00B388",
                },
              ]}
              onPress={pickResume}
            >
              <Ionicons
                name={resume ? "checkmark-circle" : "cloud-upload-outline"}
                size={18}
                color={resume ? "#fff" : "#00B388"}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.uploadText,
                  resume && { color: "#fff", fontWeight: "bold" },
                ]}
              >
                {resume ? "File Terunggah" : "Unggah"}
              </Text>
            </TouchableOpacity>
            {resume && (
              <Text style={{ fontSize: 12, color: "#00B388", marginTop: 4 }}>
                {resume.name}
              </Text>
            )}

            <Text style={styles.label}>Sertakan Bagian Profil</Text>
            {["Pengalaman", "Pendidikan", "Keahlian"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedSection(item)}
                style={styles.radioRow}
              >
                <View
                  style={[
                    styles.radioOuter,
                    selectedSection === item && styles.radioOuterSelected,
                  ]}
                >
                  {selectedSection === item && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{item}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.footerNote}>
              Jaga diri Anda. Jangan sertakan informasi sensitif dalam dokumen
              anda.
            </Text>

            {error && (
              <Text style={{ color: "red", marginTop: 16 }}>{error}</Text>
            )}
            {success && (
              <Text style={{ color: "green", marginTop: 16 }}>{success}</Text>
            )}
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Ajukan</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ApplicationForm;

// ...styles tetap sama...

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  jobCard: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    gap: 12,
  },
  logo: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    fontSize: 28,
  },
  jobTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  companyInfo: {
    fontSize: 12,
    color: "#666",
  },
  detailLink: {
    fontSize: 12,
    color: "#00B388",
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  phoneRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  codeInput: {
    width: 60,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00B388",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    width: 100,
  },
  uploadText: {
    marginLeft: 6,
    color: "#00B388",
    fontWeight: "600",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#00B388",
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: "#00B388",
    borderRadius: 5,
  },
  radioLabel: {
    fontSize: 14,
  },
  footerNote: {
    marginTop: 30,
    fontSize: 16,
    color: "#666",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00B388",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
