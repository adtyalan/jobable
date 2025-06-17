import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Komponen Kustom untuk Section dan Bullet List
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const BulletList = ({ items }) => (
  <View>
    {items.map((item, index) => (
      <View key={index} style={styles.bulletItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

const JobDetail = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Tetap */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerCard}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🔥</Text>
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.company}>
              PT Telkom Indonesia • Surabaya, Jawa Timur
            </Text>
            <Text style={styles.jobTitle}>Web Developer</Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tag}>Tunarungu</Text>
              <Text style={styles.tag}>Tunawicara</Text>
              <Text style={styles.tag}>Tunadaksa</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Konten Scrollable */}
      <ScrollView contentContainerStyle={styles.scrollSection}>
        <Section title="About Us">
          <Text style={styles.paragraph}>
            PT Telkom Indonesia membuka kesempatan bagi Anda untuk bergabung
            sebagai Web Developer. Anda akan bertugas mengembangkan, memelihara,
            dan mengoptimalkan situs web perusahaan agar mudah diakses dan
            memenuhi kebutuhan pengguna, termasuk mereka dengan disabilitas.
          </Text>
        </Section>

        <Section title="Tanggung Jawab">
          <BulletList
            items={[
              "Mengembangkan, menguji, dan memelihara aplikasi web responsif menggunakan HTML, CSS, dan JavaScript.",
              "Bekerja sama dengan tim desain, manajer produk, dan developer lain untuk menghasilkan produk digital berkualitas.",
              "Memastikan situs web dapat diakses dan dioptimalkan bagi pengguna dengan disabilitas.",
              "Menangani masalah teknis, debug, dan memperbarui aplikasi web yang sudah ada.",
              "Berpartisipasi dalam review kode dan menerapkan praktik terbaik dalam pengembangan web.",
            ]}
          />
        </Section>

        <Section title="Kualifikasi">
          <BulletList
            items={[
              "Pendidikan minimal SMA/SMK/D3 di bidang TI atau terkait",
              "Menguasai teknologi web seperti HTML, CSS, dan JavaScript",
              "Pengalaman dengan framework atau library merupakan nilai tambah",
              "Mampu bekerja mandiri maupun dalam tim",
              "Memiliki kemampuan komunikasi yang baik, terutama bagi penyandang tunarungu dan tunawicara",
              "Memiliki semangat dalam menciptakan pengalaman digital yang inklusif",
            ]}
          />
        </Section>

        <Section title="Fasilitas Perusahaan">
          <BulletList
            items={[
              "Lingkungan kerja yang ramah dan aksesibel untuk penyandang tunarungu, tunawicara, dan daksa",
              "Alat bantu komunikasi seperti interpreter bahasa isyarat atau perangkat komunikasi alternatif",
              "Fasilitas fisik yang mendukung mobilitas, seperti ramp, lift, dan area kerja yang mudah diakses",
              "Fleksibilitas khusus dan dukungan teknis untuk memaksimalkan produktivitas",
              "Penyesuaian kerja sesuai kebutuhan individu",
            ]}
          />
        </Section>
      </ScrollView>

      {/* Footer Tetap */}
      <View style={styles.footer}>
        <View style={styles.infoRowContainer}>
          <View style={styles.infoBox}>
            <MaterialIcons name="attach-money" size={22} color="#2E8B57" />
            <Text style={styles.infoText}>Rp 4.000.000 - 8.000.000</Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="briefcase-outline" size={22} color="#2E8B57" />
            <Text style={styles.infoText}>Full Time - On Site</Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={() => router.push('/jobs/form')} >
          <Text style={styles.buttonText}>Ajukan Lamaran</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// Styles tetap sama seperti sebelumnya
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBEA",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerCard: {
    flexDirection: "row",
    backgroundColor: "#00B388",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 12,
    alignItems: "center",
  },
  scrollSection: {
    paddingTop: 130,
    paddingBottom: 150,
    paddingHorizontal: 16,
  },
  logoCircle: {
    backgroundColor: "#fff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  logoText: {
    fontSize: 28,
  },
  headerContent: {
    flex: 1,
  },
  company: {
    color: "#DFF7F1",
    fontSize: 12,
  },
  jobTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#ffffff",
    color: "#333",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginTop: 4,
    fontSize: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bullet: {
    fontSize: 18,
    marginRight: 6,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    padding: 16,
    borderTopColor: "#e0e0e0",
    borderTopWidth: 1,
  },
  infoRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: "#00B388",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default JobDetail;
