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


const categories = ["Tunarungu", "Tunanetra", "Tunawicara", "Tunadaksa"];

const dummyData = {
  Tunarungu: [
    {
      id: 1,
      title: "WebDev",
      company: "PT Telkom Indonesia",
      type: "Full-time, onsite",
      location: "Surabaya, Jawa Timur",
      salary: "4.000.000",
      disability_category: "Tunarungu, Tunawicara",
    },
    {
      id: 2,
      title: "Content Writer",
      company: "PT Media Kreatif",
      type: "Full-time, onsite",
      location: "Bandung, Jawa Barat",
      salary: "3.500.000",
      disability_category: "Tunarungu",
    },
  ],
  Tunanetra: [
    {
      id: 3,
      title: "Call Center",
      company: "PT Komunikasi Mandiri",
      type: "Full-time, onsite",
      location: "Jakarta Selatan",
      salary: "4.200.000",
      disability_category: "Tunanetra",
    },
    {
      id: 4,
      title: "Data Entry",
      company: "PT Data Nusantara",
      type: "Full-time, onsite",
      location: "Semarang, Jawa Tengah",
      salary: "3.800.000",
      disability_category: "Tunanetra",
    },
  ],
  Tunawicara: [
    {
      id: 5,
      title: "Desainer Grafis",
      company: "PT Desain Visual",
      type: "Full-time, onsite",
      location: "Yogyakarta",
      salary: "4.500.000",
      disability_category: "Tunawicara",
    },
    {
      id: 6,
      title: "Editor Video",
      company: "PT Kreatif Media",
      type: "Full-time, onsite",
      location: "Surabaya",
      salary: "4.000.000",
      disability_category: "Tunawicara",
    },
  ],
  Tunadaksa: [
    {
      id: 7,
      title: "Admin Sosial Media",
      company: "PT Digital Solusi",
      type: "Full-time, onsite",
      location: "Bandung",
      salary: "3.700.000",
      disability_category: "Tunadaksa",
    },
    {
      id: 8,
      title: "QA Tester",
      company: "PT Software Global",
      type: "Full-time, onsite",
      location: "Jakarta",
      salary: "4.300.000",
      disability_category: "Tunadaksa",
    },
  ],
};

// Import ikon
import jobCompanyIcon from "../assets/images/job-category-icon.svg";
import jobCategoryIcon from "../assets/images/job-company-icon.svg";
import jobTypeIcon from "../assets/images/job-type-icon.svg";
import moneyIcon from "../assets/images/money-icon.svg";

export default function Index() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tunarungu");

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory]);

  async function fetchJobs() {
    setLoading(true);
    const data = dummyData[selectedCategory] || [];

    setTimeout(() => {
      setJobs(data);
      setLoading(false);
    }, 500);
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#FBFFE4" }}>
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
                <Text style={styles.jobCategory}>{item.disability_category}</Text>
              </View>

              <Text style={styles.jobUrgent}>Dibutuhkan Segera</Text>
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
