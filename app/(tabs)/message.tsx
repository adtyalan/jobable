import { useUserProfile } from '@/hooks/ProfileContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';

export default function Message() {
  const user = useUserProfile();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!user) return;

    // Fetch messages awal
    supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []));

    // Subscribe realtime
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await supabase.from('messages').insert({
      user_email: user.email,
      content: input,
    });
    setInput('');
  };

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Silakan login untuk melihat aplikasi kamu.</Text>
        <Button title="Login" onPress={() => router.push('/login')} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: item.user_email === user.email ? '#d1f7c4' : '#fff',
                alignSelf: item.user_email === user.email ? 'flex-end' : 'flex-start',
                marginVertical: 4,
                padding: 10,
                borderRadius: 10,
                maxWidth: '80%',
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>{item.user_email}</Text>
              <Text>{item.content}</Text>
            </View>
          )}
        />
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 20,
              paddingHorizontal: 16,
              height: 40,
              backgroundColor: '#fff',
            }}
            value={input}
            onChangeText={setInput}
            placeholder="Ketik pesan..."
          />
          <Button title="Kirim" onPress={sendMessage} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
