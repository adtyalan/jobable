import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export interface KeahlianItem {
  id: number;
  name: string;
}

interface AboutUserSkillsFromDB {
  id: number;
  user_id: string;
  skill: string[];
}

export const useAboutSkills = (userId: string | undefined) => {
  const [skills, setSkills] = useState<KeahlianItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("about_user_skills")
        .select("skill")
        .eq("user_id", userId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      if (data && Array.isArray(data.skill)) {
        // PERBAIKAN: Tambahkan tipe pada parameter
        const transformedSkills = data.skill.map(
          (name: string, index: number) => ({
            id: index,
            name: name,
          })
        );
        setSkills(transformedSkills);
      }
    } catch (error) {
      console.error("Error fetching skills data:", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [userId]);

  const addSkill = async (newSkillName: string) => {
    if (!userId) throw new Error("User ID not available");
    const currentSkillNames = skills.map((s) => s.name);
    const updatedArray = [...currentSkillNames, newSkillName];
    const { data, error } = await supabase
      .from("about_user_skills")
      .update({ skill: updatedArray })
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    if (data && Array.isArray(data.skill)) {
      // PERBAIKAN: Tambahkan tipe pada parameter
      const transformedSkills = (data.skill || []).map(
        (name: string, index: number) => ({ id: index, name })
      );
      setSkills(transformedSkills);
    }
  };

  const updateSkill = async (
    originalSkill: KeahlianItem,
    newSkillName: string
  ) => {
    if (!userId) throw new Error("User ID not available");
    const updatedArray = skills.map((s) =>
      s.id === originalSkill.id ? newSkillName : s.name
    );
    const { data, error } = await supabase
      .from("about_user_skills")
      .update({ skill: updatedArray })
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    if (data && Array.isArray(data.skill)) {
      const transformedSkills = (data.skill || []).map(
        (name: string, index: number) => ({ id: index, name })
      );
      setSkills(transformedSkills);
    }
  };

  const deleteSkill = async (skillToDelete: KeahlianItem) => {
    if (!userId) throw new Error("User ID not available");
    const updatedArray = skills
      .filter((s) => s.id !== skillToDelete.id)
      .map((s) => s.name);
    const { data, error } = await supabase
      .from("about_user_skills")
      .update({ skill: updatedArray })
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    if (data && Array.isArray(data.skill)) {
      const transformedSkills = (data.skill || []).map(
        (name: string, index: number) => ({ id: index, name })
      );
      setSkills(transformedSkills);
    } else {
      setSkills([]);
    }
  };

  return { skills, loading, addSkill, updateSkill, deleteSkill };
};
