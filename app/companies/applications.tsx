import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const job = {
  title: "WebDev",
  status: "Aktif",
  datePosted: "25 Apr 2024",
  deadline: "25 Mei 2024",
  applicants: 20,
};

const applicants = [
  {
    name: "Muhamad Sumatan",
    date: "23 Apr 2024",
    disability: "Tunarungu",
    status: "Baru",
  },
  {
    name: "Jonus Hangatad",
    date: "22 Apr 2024",
    disability: "Tunarungu",
    status: "Ditinjau",
  },
  {
    name: "Andreas Oka wrag tan",
    date: "20 Apr 2024",
    disability: "Tunarungu",
    status: "Diterima",
  },
  {
    name: "Hanto Langĥmat",
    date: "19 Apr 2024",
    disability: "Tunarungu",
    status: "Ditolak",
  },
];

export default function DetailLowongan() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Tombol Kembali */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.jobCard}>
        <Text style={styles.title}>{job.title}</Text>
        <Text
          style={[
            styles.status,
            { backgroundColor: job.status === "Aktif" ? "#009688" : "#b0bec5" },
          ]}
        >
          {job.status}
        </Text>

        <Text style={styles.info}>📅 Diposting: {job.datePosted}</Text>
        <Text style={styles.info}>⏰ Tenggat: {job.deadline}</Text>

        <View style={styles.divider} />
        <Text style={styles.subheading}>Deskripsi Pekerjaan</Text>
        <Text style={styles.description}>
          Kami mencari seorang {job.title} yang bertanggung jawab dan memiliki
          pengalaman minimal 1 tahun. Posisi ini bersifat full-time dan akan
          bekerja secara hybrid bersama tim inovatif kami di Jakarta.
        </Text>
      </View>

      {/* Statistik */}
      <View style={styles.statCard}>
        <Text style={styles.subheading}>📈 Statistik Pelamar</Text>
        <Text style={styles.info}>{job.applicants} orang telah mendaftar</Text>
      </View>

      {/* Pelamar */}
      <Text style={styles.subheading}>🧑‍💻 Daftar Pelamar</Text>
      {applicants.map((item, index) => (
        <View key={index} style={styles.applicantCard}>
          <View style={styles.leftSection}>
            <Text style={styles.applicantName}>{item.name}</Text>
            <Text style={styles.badge}>{item.disability}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={[styles.statusText, getStatusColor(item.status)]}>
              {item.status}
            </Text>
            <View style={styles.iconRow}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#555" />
              <MaterialIcons name="visibility" size={20} color="#555" />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "Baru":
      return { color: "#555" };
    case "Ditinjau":
      return { color: "#ff9800" };
    case "Diterima":
      return { color: "#4caf50" };
    case "Ditolak":
      return { color: "#f44336" };
    default:
      return { color: "#999" };
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f7fefe",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
    fontWeight: "500",
  },
  jobCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#263238",
  },
  status: {
    marginTop: 8,
    alignSelf: "flex-start",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: "600",
  },
  info: {
    fontSize: 14,
    marginTop: 6,
    color: "#555",
  },
  subheading: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "bold",
    color: "#37474f",
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    color: "#444",
    lineHeight: 20,
    textAlign: "justify",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 16,
  },
  statCard: {
    backgroundColor: "#e0f7fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  applicantCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  leftSection: {
    flex: 1,
  },
  applicantName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#212121",
  },
  badge: {
    backgroundColor: "#b2dfdb",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginVertical: 4,
    fontSize: 12,
    color: "#004d40",
  },
  dateText: {
    color: "#666",
    fontSize: 12,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 6,
  },
  iconRow: {
    flexDirection: "row",
    gap: 12,
  },
});
