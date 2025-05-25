import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
// Uncomment jika pakai React Native/Expo

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'; // Uncomment jika pakai React Native

const memoryStorage: Record<string, string | null> = {};

const storage =
  isReactNative
    ? {
        getItem: (key: string) => AsyncStorage.getItem(key),
        setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
        removeItem: (key: string) => AsyncStorage.removeItem(key),
      }
    : isBrowser
    ? {
        getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
        setItem: (key: string, value: string) => {
          localStorage.setItem(key, value);
          return Promise.resolve();
        },
        removeItem: (key: string) => {
          localStorage.removeItem(key);
          return Promise.resolve();
        },
      }
    : {
        getItem: (key: string) => Promise.resolve(memoryStorage[key] ?? null),
        setItem: (key: string, value: string) => {
          memoryStorage[key] = value;
          return Promise.resolve();
        },
        removeItem: (key: string) => {
          delete memoryStorage[key];
          return Promise.resolve();
        },
      };

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
  }
});