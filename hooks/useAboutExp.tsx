import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export interface PengalamanItem {
  id: number;
  user_id: string;
  position: string;
  workplace: string;
  timeline: string;
  location?: string;
  description?: string;
}

export const useAboutExp = (userId: string | undefined) => {
  const [experience, setExperience] = useState<PengalamanItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data (tidak berubah)
  const fetchExperience = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("about_user_exp")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: false });
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

  useEffect(() => {
    fetchExperience();
  }, [userId]);

  // --- FUNGSI-FUNGSI BARU UNTUK MANIPULASI DATA ---

  const addExperience = async (newExpData: Partial<PengalamanItem>) => {
    if (!userId) throw new Error("User ID is not available.");
    const { id, ...dataToInsert } = newExpData;

    const { data, error } = await supabase
      .from("about_user_exp")
      .insert({ ...dataToInsert, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      // Langsung perbarui state lokal untuk UI refresh instan
      setExperience((currentExp) => [data, ...currentExp]);
    }
    return data;
  };

  const updateExperience = async (
    itemId: number,
    updatedData: Partial<PengalamanItem>
  ) => {
    const { data, error } = await supabase
      .from("about_user_exp")
      .update(updatedData)
      .eq("id", itemId)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setExperience((currentExp) =>
        currentExp.map((item) => (item.id === itemId ? data : item))
      );
    }
    return data;
  };

  const deleteExperience = async (itemId: number) => {
    const { error } = await supabase
      .from("about_user_exp")
      .delete()
      .eq("id", itemId);

    if (error) throw error;
    // Hapus dari state lokal untuk UI refresh instan
    setExperience((currentExp) =>
      currentExp.filter((item) => item.id !== itemId)
    );
  };

  // Kembalikan data dan fungsi-fungsi yang bisa digunakan oleh komponen
  return {
    experience,
    loading,
    addExperience,
    updateExperience,
    deleteExperience,
  };
};
