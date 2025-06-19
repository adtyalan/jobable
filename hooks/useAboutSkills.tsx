import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase"; // Sesuaikan path jika perlu

// Tipe untuk data yang akan digunakan oleh UI (cocok dengan 'keahlianData' dummy)
export interface KeahlianItem {
  id: number; // Kita akan generate id ini saat transformasi
  name: string;
}

// Tipe untuk data mentah dari database
interface AboutUserSkillsFromDB {
  id: number;
  user_id: string;
  skill: string[]; // Kolom ini adalah array of strings
}

export const useAboutSkills = (userId: string | undefined) => {
  // State ini akan menyimpan data yang sudah ditransformasi
  const [skills, setSkills] = useState<KeahlianItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchSkills = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("about_user_skills")
          .select("skill") // Kita hanya butuh kolom 'skill'
          .eq("user_id", userId)
          .single(); // Harusnya hanya ada satu baris per user

        if (error && error.code !== "PGRST116") {
          // Abaikan error jika tidak ada baris ditemukan
          throw error;
        }

        if (data && Array.isArray(data.skill)) {
          // PROSES TRANSFORMASI DATA
          // Mengubah array string ['React', 'Figma'] menjadi
          // array objek [{id: 0, name: 'React'}, {id: 1, name: 'Figma'}]
          const transformedSkills = data.skill.map((skillName, index) => ({
            id: index, // Gunakan index sebagai id sementara untuk key di React
            name: skillName,
          }));
          setSkills(transformedSkills);
        }
      } catch (error) {
        console.error("Error fetching skills data:", (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [userId]);

  return { skills, setSkills, loading };
};
