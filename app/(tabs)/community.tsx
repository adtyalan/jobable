import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
  users: {
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
    users(full_name),
    forum_likes(id),
    forum_comments(id),
    forum_saves(id)
  `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
    } else {
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
              oleh {item.users.full_name || "Anonim"}
            </Text>
            <Text>{item.content}</Text>

            <View style={styles.metaBar}>
              <View style={styles.iconContainer}>
                <AntDesign name="like2" size={24} color="black" />
                <Text>{item.forum_likes?.length || 0}</Text>
              </View>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="comment-outline"
                  size={24}
                  color="black"
                />
                <Text>{item.forum_comments?.length || 0}</Text>
              </View>
              <View style={styles.iconContainer}>
                <Ionicons name="archive-outline" size={24} color="black" />
                <Text>{item.forum_saves?.length || 0}</Text>
              </View>
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
  iconContainer: {
    alignItems: "center",
    paddingTop: 10,
  },
});
