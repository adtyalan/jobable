import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useSupabaseUser } from "../../hooks/useSupabaseUser";
import { useVoiceRecognition } from "../../hooks/useVoice";

const GEMINI_API_KEY = "AIzaSyDor6Ig2caH9p96XikUV42CCvxLCpYOTO0";
const GEMINI_MODEL = "models/gemini-1.5-flash";

export default function Message() {
  const user = useSupabaseUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const {
    result,
    started,
    error: voiceError,
    startRecognition,
    stopRecognition,
    resetResult,
  } = useVoiceRecognition();

  useEffect(() => {
    if (result && !input) {
      setInput(result);
    }
  }, [result]);

  useFocusEffect(
    useCallback(() => {
      setMessages([
        {
          role: "bot",
          content:
            "Hai! 👋 Aku adalah SiJobo yaitu Asisten Jobable yang siap bantu kamu cari info seputar pekerjaan. Yuk mulai tanya sesuatu!",
        },
      ]);
      setInput("");
      setInputHeight(40);
      resetResult();
    }, [])
  );

// ... import tetap sama

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { role: "user", content: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setInputHeight(40);
  resetResult();
  setLoading(true);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Kamu adalah asisten virtual yang hanya menjawab pertanyaan seputar topik pekerjaan. Jika pertanyaannya tidak relevan dengan pekerjaan, jawab dengan "Maaf, saya hanya dapat menjawab seputar topik pekerjaan saja." Pertanyaan: ${input}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const rawReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, saya tidak dapat menjawab saat ini.";

    // Hapus tanda markdown seperti ** dan *
    const reply = rawReply.replace(/\*\*/g, "").replace(/\*/g, "");

    setMessages((prev) => [...prev, { role: "bot", content: reply }]);
  } catch (error) {
    console.error("Error saat fetch:", error);
    setMessages((prev) => [
      ...prev,
      { role: "bot", content: "Terjadi kesalahan saat menjawab." },
    ]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Silakan login untuk menggunakan chatbot pekerjaan.</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={{ color: "blue", marginTop: 10 }}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FBFFE4" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={100}
        >
          <View style={{ flex: 1 }}>
            {messages.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 40,
                }}
              >
                <Image
                  source={{ uri: "https://i.ibb.co/6HgyjqD/chatbot-cute.png" }}
                  style={{ width: 140, height: 140, marginBottom: 20 }}
                  resizeMode="contain"
                />
                <Text style={{ fontSize: 16, textAlign: "center", color: "#555" }}>
                  Hai! Aku siap bantu kamu cari pekerjaan. Tanyakan apa pun
                  seputar karier, yuk!
                </Text>
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                contentContainerStyle={{ padding: 20, paddingBottom: 160 }}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      alignSelf: item.role === "user" ? "flex-end" : "flex-start",
                      flexDirection: item.role === "user" ? "row-reverse" : "row",
                      marginVertical: 6,
                      maxWidth: "85%",
                    }}
                  >
                    {item.role === "bot" && (
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: "#10B981",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 6,
                        }}
                      >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>🤖</Text>
                      </View>
                    )}

                    <View
                      style={{
                        backgroundColor:
                          item.role === "user" ? "#dcfce7" : "#e0e7ff",
                        padding: 12,
                        borderRadius: 16,
                        borderTopLeftRadius: item.role === "bot" ? 0 : 16,
                        borderTopRightRadius: item.role === "user" ? 0 : 16,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2,
                        elevation: 1,
                        flexShrink: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: "#6b7280",
                          marginBottom: 4,
                        }}
                      >
                        {item.role === "user" ? "Anda" : "SiJobo"}
                      </Text>
                      <Text style={{ fontSize: 15, color: "#111827", lineHeight: 22 }}>
                        {item.content}
                      </Text>
                    </View>
                  </View>
                )}
              />
            )}

            {/* Input Area */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                marginHorizontal: 20,
                marginBottom: 60,
                alignItems: "flex-end",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {/* Mic hanya muncul di web */}
              {Platform.OS === "web" && (
                <TouchableOpacity
                  onPress={started ? stopRecognition : startRecognition}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: started ? "#047857" : "#10B981",
                    borderRadius: 50,
                    padding: 10,
                    marginRight: 8,
                  }}
                >
                  <MaterialCommunityIcons
                    name={started ? "microphone-off" : "microphone"}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              )}

              <TextInput
                style={{
                  flex: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  fontSize: 16,
                  maxHeight: 120,
                  minHeight: 40,
                  height: inputHeight,
                  textAlignVertical: "top",
                  color: "#111827",
                }}
                value={input}
                onChangeText={(text) => {
                  setInput(text);
                  if (text.trim() === "") setInputHeight(40);
                }}
                placeholder="Tanyakan seputar pekerjaan..."
                placeholderTextColor="#9ca3af"
                editable={!loading}
                multiline={true}
                onContentSizeChange={(e) => {
                  const newHeight = e.nativeEvent.contentSize.height;
                  if (input.trim() !== "") {
                    setInputHeight(Math.min(120, newHeight));
                  }
                }}
                returnKeyType="done"
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Enter" && !nativeEvent.shiftKey) {
                    nativeEvent.preventDefault?.();
                    if (!loading && input.trim() !== "") {
                      sendMessage();
                    }
                  }
                }}
              />

              <TouchableOpacity
                onPress={sendMessage}
                disabled={loading}
                activeOpacity={0.8}
                style={{
                  backgroundColor: loading ? "#ccc" : "#10B981",
                  borderRadius: 50,
                  padding: 10,
                  marginLeft: 8,
                }}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
