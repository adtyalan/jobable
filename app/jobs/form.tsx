import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ApplicationForm = () => {
  const [selectedSection, setSelectedSection] = useState("Pengalaman");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding: 16 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Ajukan Lamaran</Text>
        </View>

        {/* Job Info */}
        <View style={styles.jobCard}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🖐️</Text>
          </View>
          <View>
            <Text style={styles.jobTitle}>Web Developer</Text>
            <Text style={styles.companyInfo}>
              PT Telkom Indonesia • Surabaya, Jawa Timur
            </Text>
            <TouchableOpacity>
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
            placeholder="Contoh: 815-7562-4991"
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
        />

        <Text style={styles.label}>Resume</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="cloud-upload-outline" size={18} color="#00B388" />
          <Text style={styles.uploadText}>Unggah</Text>
        </TouchableOpacity>

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
              {selectedSection === item && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{item}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.footerNote}>
          Jaga diri Anda. Jangan sertakan informasi sensitif dalam dokumen anda.
        </Text>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Ajukan</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApplicationForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFFE4",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 16,
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
    backgroundColor: "#FFFFE4",
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
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 40,
    gap: 8,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
