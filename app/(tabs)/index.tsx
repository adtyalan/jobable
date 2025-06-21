import { useUserProfile } from '@/hooks/ProfileContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';
import { supabase } from '../../utils/supabase';

const categories = [
  { label: 'Semua', value: null },
  { label: 'Tunarungu', value: 'tunarungu' },
  { label: 'Tunanetra', value: 'tunanetra' },
  { label: 'Tunawicara', value: 'tunawicara' },
  { label: 'Tunadaksa', value: 'tunadaksa' },
];

const Index = () => {
  const { profile } = useUserProfile();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'Selamat pagi';
    if (hour >= 12 && hour < 18) return 'Selamat siang';
    if (hour >= 18 && hour < 22) return 'Selamat malam';
    return 'Selamat malam';
  }

  useEffect(() => {
    fetchJobs(selectedCategory);
  }, [selectedCategory]);

  // ...existing code...
  async function fetchJobs(category: string | null) {
    setLoading(true);
    let query = supabase.from('jobs').select('*, companies(*)'); // <-- perbaiki di sini
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (error) {
      console.error(error);
      setJobs([]);
    } else {
      setJobs(data);
    }
    setLoading(false);
  }
  // ...existing code...

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>
          {profile?.full_name ? `Selamat datang, ${profile.full_name}!` : `${getGreeting()}!`}
        </Text>
        <Text style={styles.subheading}>
          {profile?.full_name
            ? 'Semoga harimu menyenangkan.'
            : 'Silakan login untuk pengalaman lebih baik.'}
        </Text>

        <Text style={styles.kategoriTitle}>Kategori</Text>
        <View style={styles.categoryWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {categories.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() =>
                  setSelectedCategory(selectedCategory === item.value ? null : item.value)
                }
                style={[
                  styles.categoryButton,
                  selectedCategory === item.value && styles.categoryButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.value && styles.categoryTextSelected,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.rekomendasiTitle}>Rekomendasi</Text>

        {loading ? (
          <Text>Loading…</Text>
        ) : (
          <FlatList
            style={{ marginBottom: 150 }}
            scrollEnabled={false}
            data={jobs}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <Pressable style={styles.jobCard} onPress={() => router.push(`/jobs/${item.id}`)}>
                <Image
                  source={{
                    uri: item.companies?.logo || 'https://via.placeholder.com/150',
                  }}
                  style={styles.jobLogo}
                  resizeMode="cover"
                />
                <Text style={styles.jobTitle}>{item.title}</Text>
                {item.companies?.logo && <View style={styles.row}></View>}
                <View style={styles.row}>
                  <Text style={styles.jobCompany}>{item.companies?.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.jobLocation}>{item.location}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.jobType}>{item.type}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.jobSalary}>Rp. {item.salary}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.jobCategory}>{item.category}</Text>
                </View>
                <Text style={styles.jobUrgent}>Dibutuhkan Segera</Text>
              </Pressable>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  kategoriTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 10,
  },
  rekomendasiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  categoryWrapper: {
    marginBottom: 10,
    paddingVertical: 4,
    overflow: 'visible',
  },
  categoryScrollContent: {
    paddingHorizontal: 2,
    overflow: 'visible',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
    marginRight: 10,
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  categoryButtonSelected: {
    backgroundColor: '#10B981',
    zIndex: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  jobCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#14B8A6',
    borderRadius: 12,
    marginBottom: 16,
    width: '48%',
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  jobLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 6,
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 12,
    color: 'black',
  },
  jobLocation: {
    fontSize: 12,
    color: '#262626',
  },
  jobType: {
    fontSize: 12,
    color: 'black',
  },
  jobSalary: {
    fontSize: 12,
    color: 'black',
  },
  jobCategory: {
    fontSize: 12,
    color: 'black',
    fontStyle: 'italic',
  },
  jobUrgent: {
    marginTop: 4,
    color: '#262626',
    fontSize: 12,
  },
});
