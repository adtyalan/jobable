import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase"; // Sesuaikan path jika perlu

// Definisikan dan ekspor tipe PengalamanItem dari sini
export interface PengalamanItem {
  id: string;
  user_id: string;
  position: string;
  workplace: string;
  timeline: string;
  location: string;
  description: string;
}

export const useAboutExp = (userId: string | undefined) => {
  const [experience, setExperience] = useState<PengalamanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchExperience = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("about_user_exp")
          .select("*")
          .eq("user_id", userId)
          .order("id", { ascending: false }); // Urutkan dari yang terbaru

        if (error) throw error;
        if (data) setExperience(data);
      } catch (error) {
        console.error(
          "Error fetching experience data:",
          (error as Error).message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [userId]);

  return { experience, setExperience, loading };
};
