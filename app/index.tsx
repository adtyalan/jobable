import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { supabase } from "../utils/supabase";

export default function Index() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const { data, error } = await supabase.from("jobs").select("*").limit(5);
    if (error) {
      console.error(error);
    } else {
      setJobs(data);
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Selamat datang !!!</Text>
      <Text style={{ fontSize: 18, marginBottom: 0, fontWeight: "medium" }}>Muhammad Abyan Aditya</Text>
      <Text style={{ fontSize: 18, marginTop: 29, fontWeight: "bold" }}>Kategori</Text>
      {loading ? (
        <Text>Loading…</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 18 }}>{item.title}</Text>
              <Text style={{ color: "#666" }}>{item.location}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
