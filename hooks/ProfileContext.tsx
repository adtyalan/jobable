import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

// Definisikan tipe untuk profil
export type UserProfile = {
  id: string;
  full_name: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  // Tambahkan kolom lain dari tabel 'users' Anda di sini
  username?: string;
  avatar_url?: string;
};

// Definisikan tipe untuk context
type ProfileContextType = {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoading(true);
      // 1. Ambil sesi (termasuk user auth)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);

        // 2. Jika ada user, ambil profil dari tabel public.users
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
        } else {
          setProfile(userProfile);
        }
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setProfile(null); // Clear profile on logout
      } else {
        fetchSessionAndProfile(); // Refetch on login
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    profile,
    loading,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

// Hook custom untuk menggunakan context
export const useUserProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a ProfileProvider');
  }
  return context;
};
