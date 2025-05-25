import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../utils/supabase";

type Job = {
  id: number;
  company_id: number;
  title: string;
  description: string;
  location: string;
  is_open: boolean;
  created_at: string;
};

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_open", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error.message);
    } else {
      setJobs(data);
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {loading ? (
        <Text>Loading…</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/jobs/[id]",
                  params: { id: item.id.toString() },
                })
              }
              style={{ padding: 12, borderBottomWidth: 1, borderColor: "#ddd" }}
            >
              <Text style={{ fontSize: 18 }}>{item.title}</Text>
              <Text style={{ color: "#666" }}>{item.location}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
