// file: hooks/useMyApplications.ts

import { supabase } from "@/utils/supabase"; // Pastikan path ini benar
import { useEffect, useState } from "react";

// Definisikan tipe data untuk setiap item lamaran agar kode kita aman
export type ApplicationItem = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  jobs:
    | {
        // Diubah menjadi array objek
        job_title: string;
        companies:
          | {
              // Diubah menjadi array objek
              company_name: string;
              location: string;
              logo_url: string;
            }[]
          | null; // <-- Tambah []
      }[]
    | null; // <-- Tambah []
};

// Definisikan hook kita
export const useMyApplications = (userId?: string) => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jangan jalankan query jika userId belum tersedia
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      setLoading(true);

      // Query ke Supabase
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          id,
          status,
          jobs (
            job_title,
            companies (
              company_name,
              location,
              logo_url
            )
          )
        `
        )
        .eq("user_id", userId) // Ambil hanya lamaran milik user yang sedang login
        .order("created_at", { ascending: false }); // Urutkan dari yang terbaru

      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setApplications(data as ApplicationItem[]);
      }
      setLoading(false);
    };

    fetchApplications();
  }, [userId]); // useEffect ini akan berjalan kembali jika userId berubah

  // Kembalikan data dan status loading agar bisa digunakan di komponen
  return { applications, loading };
};
