import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase"; // Sesuaikan path

// Tipe untuk data yang akan digunakan oleh UI dan database
export interface AboutUserData {
  id: number;
  user_id: string;
  aksesibilitas: string[];
  preferensi_kerja: string[];
  keterampilan_khusus: string[];
}

export const useAboutUser = (userId: string | undefined) => {
  // State akan menyimpan satu objek data, atau null jika tidak ada
  const [aboutData, setAboutData] = useState<AboutUserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAboutData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("about_user")
          .select("*")
          .eq("user_id", userId)
          .single(); // Ambil hanya satu baris data

        // Abaikan error jika data tidak ditemukan, anggap saja user belum mengisi
        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          setAboutData(data);
        }
      } catch (error) {
        console.error(
          "Error fetching about user data:",
          (error as Error).message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [userId]);

  return { aboutData, setAboutData, loading };
};
