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

  const addEducation = async (newEduData: Partial<PendidikanItem>) => {
    if (!userId) throw new Error("User ID not available");
    const { id, ...dataToInsert } = newEduData;
    const { data, error } = await supabase
      .from("about_user_edu")
      .insert({ ...dataToInsert, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    if (data) setEducation((current) => [data, ...current]);
    return data;
  };

  const updateEducation = async (
    itemId: string,
    updatedData: Partial<PendidikanItem>
  ) => {
    const { data, error } = await supabase
      .from("about_user_edu")
      .update(updatedData)
      .eq("id", itemId)
      .select()
      .single();
    if (error) throw error;
    if (data)
      setEducation((current) =>
        current.map((item) => (item.id === itemId ? data : item))
      );
    return data;
  };

  const deleteEducation = async (itemId: string) => {
    const { error } = await supabase
      .from("about_user_edu")
      .delete()
      .eq("id", itemId);
    if (error) throw error;
    setEducation((current) => current.filter((item) => item.id !== itemId));
  };

  return { education, loading, addEducation, updateEducation, deleteEducation };
};
