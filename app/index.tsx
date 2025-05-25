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
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Home</Text>
      <Text style={{ marginBottom: 12 }}>Lowongan terbaru:</Text>
      {loading ? (
        <Text>Loading…</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 18 }}>{item.title}</Text>
              <Text style={{ color: "#666" }}>{item.location}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
