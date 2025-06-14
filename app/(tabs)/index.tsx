import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
import { supabase } from "../../utils/supabase";

export default function Index() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const { data, error } = await supabase.from("jobs").select("*");
    if (error) {
      console.error(error);
    } else {
      setJobs(data);
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text
        style={{
          fontFamily: "Inter_700Bold",
          fontSize: 24,
        }}
      >
        Home
      </Text>
      <Text style={{ marginBottom: 12 }}>Lowongan terbaru:</Text>
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
    </SafeAreaView>
  );
}
