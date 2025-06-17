import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/supabase";

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

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#00B388" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!job) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            Data pekerjaan tidak ditemukan.
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Link href={"/"} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={30} color="black" />
        </Link>
        {/* Header Tetap */}
        <View>
          <View style={styles.headerCard}>
            {job.companies?.logo ? (
              <Image
                source={{ uri: job.companies.logo }}
                style={styles.logoCircle}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>🔥</Text>
              </View>
            )}
            <View style={styles.headerContent}>
              <Text style={styles.company}>
                {job.companies?.name || "-"} • {job.location}
              </Text>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>{job.category}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Konten Scrollable */}
        <ScrollView contentContainerStyle={styles.scrollSection}>
          <Section title="Deskripsi Pekerjaan">
            <Text style={styles.paragraph}>
              {job.description || "Tidak ada deskripsi."}
            </Text>
          </Section>

          {job.responsibilities && (
            <Section title="Tanggung Jawab">
              <BulletList items={job.responsibilities.split("\n")} />
            </Section>
          )}

          {job.qualifications && (
            <Section title="Kualifikasi">
              <BulletList items={job.qualifications.split("\n")} />
            </Section>
          )}

          {job.facilities && (
            <Section title="Fasilitas Perusahaan">
              <BulletList items={job.facilities.split("\n")} />
            </Section>
          )}
        </ScrollView>

        {/* Footer Tetap */}
        <View style={styles.footer}>
          <View style={styles.infoRowContainer}>
            <View style={styles.infoBox}>
              <MaterialIcons name="attach-money" size={22} color="#2E8B57" />
              <Text style={styles.infoText}>
                {job.salary ? `Rp ${job.salary}` : "-"}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="briefcase-outline" size={22} color="#2E8B57" />
              <Text style={styles.infoText}>{job.type || "-"}</Text>
            </View>
          </View>

          <Pressable
            style={styles.button}
            onPress={() => router.push(`/jobs/form?id=${job.id}`)} // <-- sertakan id
          >
            <Text style={styles.buttonText}>Ajukan Lamaran</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Styles tetap sama seperti sebelumnya
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBEA",
  },
  headerCard: {
    flexDirection: "row",
    backgroundColor: "#00B388",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    alignItems: "center",
  },
  scrollSection: {
    paddingTop: 20,
    paddingBottom: 150,
    paddingHorizontal: 25,
  },
  backBtn: {
    paddingHorizontal: 18,
    paddingTop: 20,
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
