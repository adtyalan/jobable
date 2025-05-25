import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { supabase } from "../../utils/supabase";

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  company_id: string;
};

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  async function fetchJob() {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) console.error(error);
    else setJob(data);
    setLoading(false);
  }

  if (loading || !job) return <Text>Loading detail…</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{job.title}</Text>
      <Text style={{ marginVertical: 12 }}>{job.description}</Text>
      <Text>Lokasi: {job.location}</Text>
      <Button
        title="Apply Sekarang"
        // onPress={() =>
        //   router.push({
        //     pathname: "/applications/create",
        //     params: { jobId: id },
        //   })
        // }
      />
    </View>
  );
}
