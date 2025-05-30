import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../utils/supabase";

const categories = ["Tunarungu", "Tunanetra", "Tunawicara", "Tunadaksa"];

export default function Index() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tunarungu");

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory]);

  async function fetchJobs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .ilike("disability_category", `%${selectedCategory}%`) // Sesuaikan nama kolom jika beda
      .limit(5);

    if (error) {
      console.error(error);
    } else {
      setJobs(data);
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "FBFFE4" }}>
      <Text style={styles.heading}>Selamat datang !!!</Text>
      <Text style={styles.subheading}>Muhammad Abyan Aditya</Text>

      <Text style={styles.sectionTitle}>Kategori</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setSelectedCategory(item)}
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.categoryButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextSelected,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Rekomendasi</Text>
      {loading ? (
        <Text>Loading…</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.jobCard}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobLocation}>{item.location}</Text>
              <Text style={styles.jobSalary}>Rp. {item.salary}</Text>
              <Text style={styles.jobCategory}>{item.disability_category}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },

  subheading: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },

  categoryButton: {
    width: 100,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#10B981", // emerald-500
    marginRight: 10,
    backgroundColor: "#fff",
  },

  categoryButtonSelected: {
    backgroundColor: "#10B981",
  },

  categoryText: {
    fontSize: 14,
    color: "#10B981",
  },

  categoryTextSelected: {
    color: "#FBFFE4",
  },

  jobCard: {
    padding: 16,
    backgroundColor: "#CCFBF1", // bg-teal-100
    borderRadius: 12,
    marginBottom: 16,
  },

  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  jobLocation: {
    color: "#4B5563", // gray-600
  },
  jobSalary: {
    marginTop: 4,
    color: "#065F46", // dark green
  },

  jobCategory: {
    marginTop: 4,
    color: "#10B981",
    fontStyle: "italic",
  },
});