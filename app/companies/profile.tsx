import { useState } from "react";
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CompanyProfile() {
  const [selectedTab, setSelectedTab] = useState("tentang");

  const renderTabContent = () => {
    switch (selectedTab) {
      case "tentang":
        return (
          <Card>
            <Text style={styles.cardTitle}>Tentang Perusahaan</Text>
            <Text style={styles.cardText}>
              PT Telkom Indonesia adalah perusahaan terkemuka di bidang teknologi informasi dan komunikasi yang berkomitmen terhadap inklusi dan transformasi digital.
            </Text>
            <Text style={styles.cardTitle}>Visi</Text>
            <Text style={styles.cardText}>
              Menjadi penyedia layanan digital terbaik di Asia Tenggara.
            </Text>
            <Text style={styles.cardTitle}>Misi</Text>
            <Text style={styles.cardText}>
              Memberdayakan masyarakat dengan teknologi yang inklusif, terjangkau, dan berkelanjutan.
            </Text>
          </Card>
        );
      case "fasilitas":
        return (
          <Card>
            <Text style={styles.cardTitle}>Fasilitas Ramah Disabilitas</Text>
            <Text style={styles.cardText}>✅ Jalur kursi roda</Text>
            <Text style={styles.cardText}>✅ Lift suara & braille</Text>
            <Text style={styles.cardText}>✅ Ruang tenang neurodivergen</Text>
            <Text style={styles.cardText}>✅ Pelatihan kerja inklusif</Text>
          </Card>
        );
      case "penghargaan":
        return (
          <Card>
            <Text style={styles.cardTitle}>Penghargaan & Sertifikasi</Text>
            <Text style={styles.cardText}>🏆 Inklusif Terbaik 2023 – Kemnaker</Text>
            <Text style={styles.cardText}>📜 ISO 26000: Inklusi & Tanggung Jawab Sosial</Text>
            <Text style={styles.cardText}>🌟 Mitra Ramah Disabilitas oleh UNDP</Text>
          </Card>
        );
      case "galeri":
        return (
          <Card>
            <Text style={styles.cardTitle}>Galeri Perusahaan</Text>
            <View style={styles.galleryContainer}>
              {[
                "https://via.placeholder.com/150/1",
                "https://via.placeholder.com/150/2",
                "https://via.placeholder.com/150/3",
                "https://via.placeholder.com/150/4",
              ].map((url, index) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  style={styles.galleryImage}
                />
              ))}
            </View>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.companyLogo}
        />
        <Text style={styles.companyName}>PT Telkom Indonesia</Text>
        <Text style={styles.companyIndustry}>Teknologi Informasi & Komunikasi</Text>
        <Text style={styles.location}>📍 Jakarta, Indonesia</Text>
        <Text style={styles.link} onPress={() => Linking.openURL("https://www.telkom.co.id")}>🌐 www.telkom.co.id</Text>
        <Text style={styles.link} onPress={() => Linking.openURL("mailto:hr@telkom.co.id")}>📧 hr@telkom.co.id</Text>

        {/* Tombol hanya Edit Profil */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>✏️ Edit Profil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistik */}
      <View style={styles.statBox}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Lowongan Aktif</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>57</Text>
          <Text style={styles.statLabel}>Pelamar Masuk</Text>
        </View>
      </View>

      {/* Tab */}
      <View style={styles.tabContainer}>
        {["tentang", "fasilitas", "penghargaan", "galeri"].map((tab) => (
          <TabButton
            key={tab}
            label={tab.charAt(0).toUpperCase() + tab.slice(1)}
            value={tab}
            selectedTab={selectedTab}
            onPress={setSelectedTab}
          />
        ))}
      </View>

      {/* Konten Tab */}
      {renderTabContent()}
    </ScrollView>
  );
}

function TabButton({ label, value, selectedTab, onPress }) {
  const isSelected = selectedTab === value;
  return (
    <TouchableOpacity
      style={[styles.tabButton, isSelected && styles.tabButtonActive]}
      onPress={() => onPress(value)}
    >
      <Text style={[styles.tabButtonText, isSelected && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fcff",
    padding: 16,
  },
  headerCard: {
    alignItems: "center",
    backgroundColor: "#d1f2eb",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  companyLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004d40",
  },
  companyIndustry: {
    color: "#555",
    fontSize: 14,
  },
  location: {
    fontSize: 13,
    color: "#666",
  },
  link: {
    color: "#00796b",
    textDecorationLine: "underline",
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderColor: "#004d40",
    borderWidth: 1,
  },
  actionText: {
    color: "#004d40",
    fontWeight: "bold",
  },
  statBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e0f2f1",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796b",
  },
  statLabel: {
    fontSize: 13,
    color: "#555",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 5,
  },
  tabButtonActive: {
    backgroundColor: "#00796b",
    borderColor: "#00796b",
  },
  tabButtonText: {
    fontSize: 13,
    color: "#333",
  },
  tabButtonTextActive: {
    color: "white",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    color: "#004d40",
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
    marginBottom: 4,
  },
  galleryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
});
