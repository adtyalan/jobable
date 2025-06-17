import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/supabase";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const showAlertLogin = () => {
  Alert.alert(
    "Akses dibatasi",
    "Silakan login dahulu untuk menggunakan fitur ini."
  );
};

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  users: {
    full_name: string;
  };
  forum_likes: { id: string }[];
  forum_comments: { id: string }[];
  forum_saves: { id: string }[];
};

export default function Comunity() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // State untuk modal komentar
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [newComment, setNewComment] = useState(""); // State untuk teks input
  const [isSubmittingComment, setIsSubmittingComment] = useState(false); // State loading saat kirim

  // Untuk animasi slide down
  const translateY = useState(new Animated.Value(SCREEN_HEIGHT))[0];

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id ?? null);
    };
    getUser();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from("forum_posts")
      .select(
        `
      id, title, content, created_at,
      users(full_name),
      forum_likes(id, user_id),
      forum_comments(id),
      forum_saves(id, user_id)
    `
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);

      // Cek like/save milik user
      if (userId) {
        setLikedPosts(
          data
            .filter((post) =>
              post.forum_likes.some((like) => like.user_id === userId)
            )
            .map((post) => post.id)
        );
        setSavedPosts(
          data
            .filter((post) =>
              post.forum_saves.some((save) => save.user_id === userId)
            )
            .map((post) => post.id)
        );
      }
    }
    setLoading(false);
  }

  // Fungsi fetch komentar
  const fetchComments = async (postId: string) => {
    setLoadingComments(true);
    const { data, error } = await supabase
      .from("forum_comments")
      .select("id, content, created_at, users(full_name)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (!error) setComments(data);
    setLoadingComments(false);
  };

  // ...setelah fungsi fetchComments

  const handleLike = async (post: Post) => {
    if (!userId) {
      showAlertLogin();
      return;
    }
    const alreadyLiked = likedPosts.includes(post.id);

    if (alreadyLiked) {
      // Unlike
      const { error } = await supabase
        .from("forum_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", userId);
      if (!error) {
        setLikedPosts(likedPosts.filter((id) => id !== post.id));
        setPosts((posts) =>
          posts.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  forum_likes: p.forum_likes.filter(
                    (l) => l.user_id !== userId
                  ),
                }
              : p
          )
        );
      }
    } else {
      // Like
      const { data, error } = await supabase
        .from("forum_likes")
        .insert({ post_id: post.id, user_id: userId })
        .select("id, user_id")
        .single();
      if (!error && data) {
        setLikedPosts([...likedPosts, post.id]);
        setPosts((posts) =>
          posts.map((p) =>
            p.id === post.id
              ? { ...p, forum_likes: [...p.forum_likes, data] }
              : p
          )
        );
      }
    }
  };

  const handleSave = async (post: Post) => {
    if (!userId) {
      showAlertLogin();
      return;
    }
    const alreadySaved = savedPosts.includes(post.id);

    if (alreadySaved) {
      // Unsave
      const { error } = await supabase
        .from("forum_saves")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", userId);
      if (!error) {
        setSavedPosts(savedPosts.filter((id) => id !== post.id));
        setPosts((posts) =>
          posts.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  forum_saves: p.forum_saves.filter(
                    (s) => s.user_id !== userId
                  ),
                }
              : p
          )
        );
      }
    } else {
      // Save
      const { data, error } = await supabase
        .from("forum_saves")
        .insert({ post_id: post.id, user_id: userId })
        .select("id, user_id")
        .single();
      if (!error && data) {
        setSavedPosts([...savedPosts, post.id]);
        setPosts((posts) =>
          posts.map((p) =>
            p.id === post.id
              ? { ...p, forum_saves: [...p.forum_saves, data] }
              : p
          )
        );
      }
    }
  };

  // Fungsi untuk menambah komentar baru
  const handleAddComment = async () => {
    if (!userId) {
      showAlertLogin();
      return;
    }
    if (!newComment.trim() || !selectedPost) return; // Validasi input tidak kosong

    setIsSubmittingComment(true);

    // 1. Dapatkan data user yang sedang login
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      console.error("No user session found");
      setIsSubmittingComment(false);
      return;
    }
    const userId = session.user.id;

    // 2. Siapkan data untuk dimasukkan ke tabel
    const commentToInsert = {
      post_id: selectedPost.id,
      user_id: userId,
      content: newComment.trim(),
    };

    // 3. Insert ke Supabase
    const { data, error } = await supabase
      .from("forum_comments")
      .insert(commentToInsert)
      .select("*, users(full_name)") // Ambil kembali data lengkap setelah insert
      .single();

    if (error) {
      console.error("Error adding comment:", error.message);
    } else if (data) {
      // 4. Perbarui UI secara optimis (tambahkan komentar baru ke daftar)
      setComments((prevComments) => [...prevComments, data]);
      setNewComment(""); // Kosongkan input
    }

    setIsSubmittingComment(false);
  };

  // Animasi buka modal + fetch komentar
  const openCommentModal = (post: Post) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
    fetchComments(post.id); // Fetch komentar sesuai id post
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  // Animasi tutup modal
  const closeCommentModal = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCommentModalVisible(false);
      setSelectedPost(null);
    });
  };

  // Gesture slide down
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        closeCommentModal();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Memuat postingan...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, marginVertical: 50 }}>
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
                <View style={styles.likeCommentBar}>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => handleLike(item)}
                  >
                    <AntDesign
                      name={likedPosts.includes(item.id) ? "like1" : "like2"}
                      size={24}
                      color={likedPosts.includes(item.id) ? "#00A991" : "black"}
                    />
                    <Text>{item.forum_likes?.length || 0}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => openCommentModal(item)}
                  >
                    <MaterialCommunityIcons
                      name="comment-outline"
                      size={24}
                      color="black"
                    />
                    <Text>{item.forum_comments?.length || 0}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => handleSave(item)}
                >
                  <Ionicons
                    name={
                      savedPosts.includes(item.id)
                        ? "archive"
                        : "archive-outline"
                    }
                    size={24}
                    color={savedPosts.includes(item.id) ? "#00A991" : "black"}
                  />
                  <Text>{item.forum_saves?.length || 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Modal Komentar Full-Screen */}
        <Modal
          visible={commentModalVisible}
          animationType="slide" // Gunakan animasi slide bawaan
          onRequestClose={closeCommentModal}
        >
          {/* Gunakan SafeAreaView di dalam modal untuk tampilan full-screen yang aman */}
          <SafeAreaView style={styles.modalContainer}>
            {/* Header Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedPost?.title}
              </Text>
              <TouchableOpacity
                onPress={closeCommentModal}
                style={styles.closeIcon}
              >
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>

            {/* Daftar Komentar (UI Fetch & list tetap ada) */}
            <FlatList
              style={styles.commentList}
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              ListHeaderComponent={() => (
                // Tampilkan loading atau pesan "belum ada komentar"
                <>
                  {loadingComments && (
                    <ActivityIndicator style={{ marginVertical: 20 }} />
                  )}
                  {!loadingComments && comments.length === 0 && (
                    <Text style={styles.noCommentsText}>
                      Belum ada komentar. Jadilah yang pertama!
                    </Text>
                  )}
                </>
              )}
              renderItem={({ item }) => (
                <View style={styles.commentCard}>
                  <Text style={styles.commentAuthor}>
                    {item.users?.full_name || "Anonim"}
                  </Text>
                  <Text>{item.content}</Text>
                  <Text style={styles.commentDate}>
                    {new Date(item.created_at).toLocaleString("id-ID")}
                  </Text>
                </View>
              )}
            />

            {/* Input Komentar (UI dari Bagian 1 tetap ada) */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            >
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Tulis komentar..."
                  value={newComment} // state dari Bagian 1
                  onChangeText={setNewComment} // state dari Bagian 1
                  multiline
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleAddComment} // fungsi dari Bagian 1
                  disabled={isSubmittingComment} // state dari Bagian 1
                >
                  {isSubmittingComment ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="send" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // ...existing styles...
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postCard: {
    marginHorizontal: Platform.OS === "web" ? 30 : 30,
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#00A991",
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
    flexDirection: "row",
    gap: 4,
  },
  likeCommentBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1,
    gap: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1, // Agar title tidak mendorong tombol close
  },
  closeIcon: {
    padding: 4,
  },
  commentList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  noCommentsText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontStyle: "italic",
  },
  commentCard: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 6,
  },
  commentAuthor: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 8,
    textAlign: "right",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
    maxHeight: "80%",
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#00A991",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 8,
    backgroundColor: "#fff",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#00A991",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
