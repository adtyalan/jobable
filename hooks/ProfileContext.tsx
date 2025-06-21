import { Session, User } from "@supabase/supabase-js";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../utils/supabase";

// Definisikan tipe untuk profil
export type UserProfile = {
  id: string;
  full_name: string;
  role: "job_seeker" | "recruiter" | "admin";
  username?: string;
  avatar?: string;
  job_seeker_users: {
    disability: string;
    biography: string;
  }[];
};

// Definisikan tipe untuk context
type ProfileContextType = {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessionAndProfile = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setSession(session);
        setUser(session.user);

        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select(`*, job_seeker_users (disability, biography)`)
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }
        setProfile(userProfile as UserProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", (error as Error).message);
      setProfile(null); // Reset profile jika ada error
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          setProfile(null);
        } else {
          fetchSessionAndProfile();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    profile,
    loading,
    fetchProfile: fetchSessionAndProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

// Hook custom untuk menggunakan context
export const useUserProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a ProfileProvider");
  }
  return context;
};
