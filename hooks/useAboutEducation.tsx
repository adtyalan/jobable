import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

// Definisikan dan ekspor tipe dari sini
export interface PendidikanItem {
  id: string; // atau number, sesuaikan dengan DB Anda
  user_id: string;
  instance: string; // Mengganti 'school' agar cocok dengan DB Anda
  major: string;
  timeline: string;
  status: string;
}

export const useAboutEducation = (userId: string | undefined) => {
  const [education, setEducation] = useState<PendidikanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchEducation = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("about_user_edu")
          .select("*")
          .eq("user_id", userId)
          .order("id", { ascending: false });

        if (error) throw error;
        if (data) setEducation(data);
      } catch (error) {
        console.error(
          "Error fetching education data:",
          (error as Error).message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [userId]);

  return { education, setEducation, loading };
};
