import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/supabase"; // pastikan path ini sesuai

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  forum_posts_user_id_fkey?: {
    full_name: string;
  };
  forum_likes: { id: string }[]; // Untuk hitung jumlah like
  forum_comments: { id: string }[]; // Untuk hitung jumlah komen
  forum_saves: { id: string }[]; // Untuk hitung jumlah save
};

export default function Comunity() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from("forum_posts")
      .select(
        `
    id, title, content, created_at,
    forum_posts_user_id_fkey(full_name),
    forum_likes(id),
    forum_comments(id),
    forum_saves(id)
  `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
    } else {
      console.log("DATA FORUM POSTS:", data); // Tambahkan ini
      setPosts(data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Memuat postingan...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>
              oleh {item.forum_posts_user_id_fkey?.full_name || "Anonim"}
            </Text>
            <Text>{item.content}</Text>

            <View style={styles.metaBar}>
              <Text>❤️ {item.forum_likes?.length || 0}</Text>
              <Text>💬 {item.forum_comments?.length || 0}</Text>
              <Text>🔖 {item.forum_saves?.length || 0}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  author: {
    fontSize: 14,
    color: "gray",
    marginBottom: 8,
  },
  metaBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
