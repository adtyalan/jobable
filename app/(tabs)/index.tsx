import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
import { supabase } from "../../utils/supabase";

// Import ikon
import jobCompanyIcon from "../assets/images/job-category-icon.svg";
import jobCategoryIcon from "../assets/images/job-company-icon.svg";
import jobTypeIcon from "../assets/images/job-type-icon.svg";
import moneyIcon from "../assets/images/money-icon.svg";

// Kategori
const categories = ["Tunarungu", "Tunanetra", "Tunawicara", "Tunadaksa"];

const Index = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tunarungu");

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .ilike("disability_category", `%${selectedCategory}%`);
      if (error) {
        console.warn("Supabase error:", error.message);
        setJobs([]);
      } else {
        setJobs(data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#FBFFE4" }}>
      <Text style={styles.heading}>Selamat pagi !</Text>
      <Text style={styles.subheading}>Muhammad Abyan Aditya</Text>

      <Text style={styles.kategoriTitle}>Kategori</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 40, marginBottom: 10 }}
        contentContainerStyle={{ alignItems: "center" }}
      >
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

      <Text style={styles.rekomendasiTitle}>Rekomendasi</Text>

      {loading ? (
        <Text>Loading…</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <View style={styles.jobCard}>
              <Text style={styles.jobTitle}>{item.title}</Text>

              <View style={styles.row}>
                <Image source={jobCompanyIcon} style={styles.icon} />
                <Text style={styles.jobCompany}>{item.company}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.jobLocation}>{item.location}</Text>
              </View>

              <View style={styles.row}>
                <Image source={jobTypeIcon} style={styles.icon} />
                <Text style={styles.jobType}>{item.type}</Text>
              </View>

              <View style={styles.row}>
                <Image source={moneyIcon} style={styles.icon} />
                <Text style={styles.jobSalary}>Rp. {item.salary}</Text>
              </View>

              <View style={styles.row}>
                <Image source={jobCategoryIcon} style={styles.icon} />
                <Text style={styles.jobCategory}>
                  {item.disability_category}
                </Text>
              </View>

              <Text style={styles.jobUrgent}>Dibutuhkan Segera</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Index;

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
  kategoriTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 28,
    marginBottom: 10,
  },
  rekomendasiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 10,
  },
  categoryButton: {
    width: 100,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#10B981",
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
    padding: 12,
    backgroundColor: "#14B8A6",
    borderRadius: 12,
    marginBottom: 16,
    width: "48%",
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  icon: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
  jobCompany: {
    fontSize: 12,
    color: "#fff",
  },
  jobLocation: {
    fontSize: 12,
    color: "#262626",
  },
  jobType: {
    fontSize: 12,
    color: "#D1FAE5",
  },
  jobSalary: {
    fontSize: 12,
    color: "#D1FAE5",
  },
  jobCategory: {
    fontSize: 12,
    color: "#BBF7D0",
    fontStyle: "italic",
  },
  jobUrgent: {
    marginTop: 4,
    color: "#262626",
    fontSize: 12,
  },
});
