import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

let storage: any = undefined;

// Hanya gunakan AsyncStorage jika di React Native/Expo
if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  import('@react-native-async-storage/async-storage').then((module) => {
    storage = module.default;
  });
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
