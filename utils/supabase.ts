import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
// Uncomment jika pakai React Native/Expo

const SUPABASE_URL = 'https://gmoyzspwcrlihwjgmxzh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtb3l6c3B3Y3JsaWh3amdteHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzAxMjQsImV4cCI6MjA2Mjg0NjEyNH0.VUnRQnhL9UTZKegGofy5HLAoih05vM7tsE8EYiJwiR8';

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