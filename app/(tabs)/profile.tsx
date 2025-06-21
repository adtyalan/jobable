import { useUserProfile } from "@/hooks/ProfileContext";
import { PendidikanItem, useAboutEducation } from "@/hooks/useAboutEducation";
import { PengalamanItem, useAboutExp } from "@/hooks/useAboutExp";
import { KeahlianItem, useAboutSkills } from "@/hooks/useAboutSkills"; // Impor hook baru
import { AboutUserData, useAboutUser } from "@/hooks/useAboutUser"; // Impor hook baru
import { supabase } from "@/utils/supabase";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image, // <-- TAMBAHKAN INI
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";

const categories = ["Tentang", "Pengalaman", "Pendidikan", "Keahlian"];
type InfoCardProps = {
  title: string;
  items: string[];
  onEdit: () => void;
};
type ExperienceCardProps = {
  title: string;
  subtitle: string;
  date: string;
  location?: string;
  description?: string;
  onEdit: () => void;
};

type TentangSectionProps = {
  data: AboutUserData | null;
  onEdit: (item: any, type: string) => void;
};
type PengalamanSectionProps = {
  data: PengalamanItem[];
  onAdd: () => void;
  onEdit: (item: PengalamanItem, type: string) => void;
};
type PendidikanSectionProps = {
  data: PendidikanItem[];
  onAdd: () => void;
  onEdit: (item: PendidikanItem, type: string) => void;
};
type KeahlianSectionProps = {
  data: KeahlianItem[];
  onAdd: () => void;
  onEdit: (item: KeahlianItem, type: string) => void;
};

const FormTambahPengalaman: React.FC<{
  formData: Partial<PengalamanItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<PengalamanItem>>>;
}> = ({ formData, setFormData }) => {
  return (
    <>
      <TextInput
        style={styles.modalInput}
        placeholder="Role / Jabatan"
        value={formData.position}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, position: text }))
        }
        placeholderTextColor="#8A8A8A"
      />
      <TextInput
        style={styles.modalInput}
        placeholder="Nama Perusahaan"
        value={formData.workplace}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, workplace: text }))
        }
        placeholderTextColor="#8A8A8A"
      />
      <TextInput
        style={styles.modalInput}
        placeholder="Tanggal (Contoh: 2024 - Sekarang)"
        value={formData.timeline}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, timeline: text }))
        }
        placeholderTextColor="#8A8A8A"
      />
      <TextInput
        style={styles.modalInput}
        placeholder="Lokasi (Opsional)"
        placeholderTextColor="#8A8A8A"
        value={formData.location}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, location: text }))
        }
      />
      <TextInput
        style={[styles.modalInput, { height: 80, textAlignVertical: "top" }]}
        placeholder="Deskripsi Pekerjaan"
        placeholderTextColor="#8A8A8A"
        multiline
        value={formData.description}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, description: text }))
        }
      />
    </>
  );
};

const FormTambahPendidikan: React.FC<{
  formData: Partial<PendidikanItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<PendidikanItem>>>;
}> = ({ formData, setFormData }) => {
  return (
    <>
      <TextInput
        style={styles.modalInput}
        placeholder="Nama Sekolah / Universitas"
        value={formData.instance}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, instance: text }))
        }
        placeholderTextColor="#8A8A8A"
      />
      <TextInput
        style={styles.modalInput}
        placeholder="Jurusan / Gelar"
        value={formData.major}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, major: text }))
        }
        placeholderTextColor="#8A8A8A"
      />
      <TextInput
        style={styles.modalInput}
        placeholder="Tahun (Contoh: 2020 - 2023)"
        value={formData.timeline}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, timeline: text }))
        }
        placeholderTextColor="#8A8A8A"
      />
    </>
  );
};

const FormTambahKeahlian: React.FC<{
  formData: Partial<KeahlianItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<KeahlianItem>>>;
}> = ({ formData, setFormData }) => {
  return (
    <TextInput
      style={styles.modalInput}
      placeholder="Nama Keahlian (Contoh: UI/UX Design)"
      value={formData.name}
      onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
      placeholderTextColor="#8A8A8A"
    />
  );
};

const InfoCard: React.FC<InfoCardProps> = ({ title, items, onEdit }) => (
  <View style={styles.infoCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.titleContent}>{title}</Text>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editButtonText}>Edit ✏️</Text>
      </TouchableOpacity>
    </View>
    {items.map((item, index) => (
      <View key={index} style={styles.listItem}>
        <Text style={styles.bullet}>{"\u2022"}</Text>
        <Text style={styles.listItemText}>{item}</Text>
      </View>
    ))}
  </View>
);

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  subtitle,
  date,
  location,
  description,
  onEdit,
}) => (
  <View style={styles.infoCard}>
    <View style={styles.cardHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.titleContent}>{title}</Text>
        <Text style={styles.subtitleContent}>{subtitle}</Text>
        <Text style={styles.dateContent}>{date}</Text>
        {location && <Text style={styles.dateContent}>{location}</Text>}
      </View>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editButtonText}>Edit ✏️</Text>
      </TouchableOpacity>
    </View>
    {description && (
      <Text style={styles.descriptionContent}>{description}</Text>
    )}
  </View>
);

const TentangSection: React.FC<TentangSectionProps> = ({ data, onEdit }) => {
  console.log("--- DEBUGGING DETAIL TENTANG SECTION ---");
  if (data) {
    console.log("Tipe dari data.aksesibilitas:", typeof data.aksesibilitas);
    console.log(
      "Apakah data.aksesibilitas sebuah Array?",
      Array.isArray(data.aksesibilitas)
    );
    console.log("Isi mentah data.aksesibilitas:", data.aksesibilitas);
  } else {
    console.log("Objek 'data' masih null");
  }
  console.log("--- AKHIR DEBUGGING ---");

  // Jika data belum ada, tampilkan pesan atau loading
  if (!data) {
    return (
      <View style={styles.infoCard}>
        <Text style={styles.listItemText}>
          Memuat data atau data belum diisi...
        </Text>
      </View>
    );
  }

  return (
    <>
      <InfoCard
        title="Aksesibilitas"
        items={data.aksesibilitas || []}
        onEdit={() => onEdit(data, "Aksesibilitas")}
      />
      <InfoCard
        title="Preferensi Kerja"
        items={data.preferensi_kerja || []}
        onEdit={() => onEdit(data, "Preferensi Kerja")}
      />
      <InfoCard
        title="Keterampilan Khusus"
        items={data.keterampilan_khusus || []}
        onEdit={() => onEdit(data, "Keterampilan Khusus")}
      />
    </>
  );
};

const PengalamanSection: React.FC<PengalamanSectionProps> = ({
  data,
  onAdd,
  onEdit,
}) => (
  <View style={styles.sectionContainer}>
    <TouchableOpacity style={styles.addButton} onPress={onAdd}>
      <Text style={styles.addButtonText}>+ Tambah Pengalaman</Text>
    </TouchableOpacity>
    {data.map((item) => (
      <ExperienceCard
        key={item.id}
        title={item.position}
        subtitle={item.workplace}
        date={item.timeline}
        location={item.location}
        description={item.description}
        onEdit={() => onEdit(item, "Pengalaman")}
      />
    ))}
  </View>
);

const PendidikanSection: React.FC<PendidikanSectionProps> = ({
  data,
  onAdd,
  onEdit,
}) => (
  <View style={styles.sectionContainer}>
    <TouchableOpacity style={styles.addButton} onPress={onAdd}>
      <Text style={styles.addButtonText}>+ Tambah Pendidikan</Text>
    </TouchableOpacity>
    {data.map((item) => (
      <ExperienceCard
        key={item.id}
        title={item.instance}
        subtitle={item.major}
        date={item.timeline}
        onEdit={() => onEdit(item, "Pendidikan")}
      />
    ))}
  </View>
);

const KeahlianSection: React.FC<KeahlianSectionProps> = ({
  data,
  onAdd,
  onEdit,
}) => (
  <View style={styles.sectionContainer}>
    <TouchableOpacity style={styles.addButton} onPress={onAdd}>
      <Text style={styles.addButtonText}>+ Tambah Keahlian lainnya</Text>
    </TouchableOpacity>

    {data.map((item) => (
      // PERUBAHAN: Kita tidak lagi membungkus seluruh baris dengan TouchableOpacity.
      // 'key' sekarang ada di View terluar.
      <View key={item.id} style={styles.skillItemBar}>
        <Text style={styles.skillItemText}>{item.name}</Text>

        {/* PERBAIKAN: Tambahkan tombol Edit di sini */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(item, "Keahlian")}
        >
          <Text style={styles.editButtonText}>Edit ✏️</Text>
        </TouchableOpacity>
      </View>
    ))}
  </View>
);

const ListManagementForm: React.FC<{
  modalType: string;
  listInModal: string[];
  setListInModal: React.Dispatch<React.SetStateAction<string[]>>;
  onSave: () => void;
  onOpenAddItem: () => void;
}> = ({ modalType, listInModal, setListInModal, onSave, onOpenAddItem }) => {
  const handleItemDelete = (indexToDelete: number) => {
    setListInModal((currentList) =>
      currentList.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Edit {modalType}</Text>
        <ScrollView style={{ width: "100%", marginVertical: 10, flex: 1 }}>
          {listInModal.length > 0 ? (
            listInModal.map((item, index) => (
              <View key={index} style={styles.listItemInModal}>
                <Text style={styles.listItemTextInModal}>{item}</Text>
                <TouchableOpacity
                  style={styles.deleteItemButton}
                  onPress={() => handleItemDelete(index)}
                >
                  <Text style={styles.deleteItemButtonText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyListText}>Belum ada data.</Text>
          )}
        </ScrollView>
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={[styles.modalButton, styles.addButtonBlue]}
            onPress={onOpenAddItem}
          >
            <Text style={styles.modalButtonText}>Tambah Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={onSave}
          >
            <Text style={styles.modalButtonText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default function ApplicationsPage() {
  // PERBAIKAN: Ambil 'loading' dan ubah namanya menjadi 'userLoading'
  const { user, loading: userLoading, profile } = useUserProfile();
  const {
    education,
    loading: educationLoading,
    addEducation,
    updateEducation,
    deleteEducation,
  } = useAboutEducation(user?.id);
  const {
    experience,
    loading: experienceLoading,
    addExperience,
    updateExperience,
    deleteExperience,
  } = useAboutExp(user?.id);
  const {
    skills,
    loading: skillsLoading,
    addSkill,
    updateSkill,
    deleteSkill,
  } = useAboutSkills(user?.id);

  const {
    aboutData,
    loading: aboutLoading,
    updateAboutList,
  } = useAboutUser(user?.id);

  const [selectedCategory, setSelectedCategory] = useState("Tentang");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [newExperience, setNewExperience] = useState<Partial<PengalamanItem>>({
    position: "",
    workplace: "",
    timeline: "",
    location: "",
    description: "",
  });
  const [newEducation, setNewEducation] = useState<Partial<PendidikanItem>>({
    instance: "",
    major: "",
    timeline: "",
  });
  const [newSkill, setNewSkill] = useState<Partial<KeahlianItem>>({
    name: "",
  });

  const [listInModal, setListInModal] = useState<string[]>([]);
  const [isAddItemModalVisible, setAddItemModalVisible] = useState(false);
  const [newItemText, setNewItemText] = useState("");

  const { width } = useWindowDimensions();
  const desktopBreakpoint = 768; // Breakpoint bisa disesuaikan
  const isDesktop = width >= desktopBreakpoint;

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Silakan login untuk melihat aplikasi kamu.</Text>
        <Button title="Login" onPress={() => router.push("/login")} />
      </View>
    );
  }

  if (
    userLoading ||
    educationLoading ||
    experienceLoading ||
    skillsLoading ||
    aboutLoading
  ) {
    return (
      <ActivityIndicator
        style={styles.centeredLoading}
        size="large"
        color="#00A991"
      />
    );
  }

  const handleSaveAboutChanges = async () => {
    if (!user || !modalType) return;

    // Konversi tipe modal menjadi nama kolom yang valid
    const dbColumnName = modalType.toLowerCase().replace(/ /g, "_") as
      | "aksesibilitas"
      | "preferensi_kerja"
      | "keterampilan_khusus";

    try {
      await updateAboutList(dbColumnName, listInModal); // Panggil fungsi dari hook
      Alert.alert("Sukses", "Data berhasil diperbarui.");
      closeModal();
    } catch (error) {
      Alert.alert("Gagal", "Gagal menyimpan perubahan.");
      console.error(error);
    }
  };

  const handleDeleteItem = () => {
    const performDelete = async () => {
      if (!editingItem) return;
      try {
        if (modalType === "Pengalaman") await deleteExperience(editingItem.id);
        else if (modalType === "Pendidikan")
          await deleteEducation(editingItem.id);
        else if (modalType === "Keahlian") await deleteSkill(editingItem);
        closeModal();
      } catch (error) {
        Alert.alert("Gagal", `Gagal menghapus data ${modalType}.`);
        console.error(error);
      }
    };

    Alert.alert(`Hapus ${modalType}`, `Anda yakin ingin menghapus data ini?`, [
      { text: "Batal", style: "cancel" },
      { text: "Ya, Hapus", style: "destructive", onPress: performDelete },
    ]);
  };

  const handleAddNewItemToList = () => {
    if (newItemText.trim() === "")
      return Alert.alert("Input Kosong", "Harap isi data.");
    setListInModal((currentList) => [...currentList, newItemText.trim()]);
    setNewItemText("");
    setAddItemModalVisible(false);
  };

  const handleModalSubmit = async () => {
    try {
      if (editingItem) {
        // --- LOGIKA EDIT ---
        if (modalType === "Pengalaman") {
          await updateExperience(editingItem.id, newExperience);
        } else if (modalType === "Pendidikan") {
          await updateEducation(editingItem.id, newEducation);
        } else if (modalType === "Keahlian") {
          if (!newSkill.name)
            return Alert.alert("Error", "Nama keahlian tidak boleh kosong.");
          await updateSkill(editingItem, newSkill.name);
        }
      } else {
        // --- LOGIKA TAMBAH ---
        if (modalType === "Pengalaman") {
          if (!newExperience.position || !newExperience.workplace)
            return Alert.alert("Error", "Posisi dan Perusahaan wajib diisi.");
          await addExperience(newExperience);
        } else if (modalType === "Pendidikan") {
          if (!newEducation.instance || !newEducation.major)
            return Alert.alert("Error", "Institusi dan Jurusan wajib diisi.");
          await addEducation(newEducation);
        } else if (modalType === "Keahlian") {
          if (!newSkill.name)
            return Alert.alert("Error", "Nama keahlian wajib diisi.");
          await addSkill(newSkill.name);
        }
      }
      closeModal(); // Tutup modal jika salah satu aksi di atas berhasil
    } catch (error) {
      Alert.alert("Gagal", `Gagal memproses data ${modalType}.`);
      console.error(error);
    }
  };

  const openAddModal = (type: string) => {
    setEditingItem(null);
    setModalType(type);
    setModalVisible(true);
  };

  const openEditModal = (item: any, type: string) => {
    setEditingItem(item);
    setModalType(type);

    if (
      ["Aksesibilitas", "Preferensi Kerja", "Keterampilan Khusus"].includes(
        type
      )
    ) {
      const dbColumnName = type
        .toLowerCase()
        .replace(/ /g, "_") as keyof AboutUserData;
      setListInModal(item[dbColumnName] || []);
    } else if (type === "Pengalaman") {
      setNewExperience(item);
    } else if (type === "Pendidikan") {
      setNewEducation(item);
    } else if (type === "Keahlian") {
      setNewSkill(item);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    setNewExperience({
      position: "",
      workplace: "",
      timeline: "",
      location: "",
      description: "",
    });
    setNewEducation({ instance: "", major: "", timeline: "" });
    setNewSkill({ name: "" });
  };

  const renderModalContent = () => {
    if (
      ["Aksesibilitas", "Preferensi Kerja", "Keterampilan Khusus"].includes(
        modalType
      )
    ) {
      return (
        <ListManagementForm
          modalType={modalType}
          listInModal={listInModal}
          setListInModal={setListInModal}
          onSave={handleSaveAboutChanges}
          onOpenAddItem={() => setAddItemModalVisible(true)}
        />
      );
    }
    let formComponent;
    switch (modalType) {
      case "Pengalaman":
        formComponent = (
          <FormTambahPengalaman
            formData={newExperience}
            setFormData={setNewExperience}
          />
        );
        break;
      case "Pendidikan":
        formComponent = (
          <FormTambahPendidikan
            formData={newEducation}
            setFormData={setNewEducation}
          />
        );
        break;
      case "Keahlian":
        formComponent = (
          <FormTambahKeahlian formData={newSkill} setFormData={setNewSkill} />
        );
        break;
      default:
        return null;
    }

    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>
          {editingItem ? "Edit" : "Tambah"} {modalType}
        </Text>
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {formComponent}
        </ScrollView>
        <View style={styles.modalButtonContainer}>
          {editingItem && (
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={handleDeleteItem}
            >
              <Text style={styles.deleteButtonText}>Hapus</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={handleModalSubmit}
          >
            <Text style={styles.modalButtonText}>
              {editingItem ? "Simpan Perubahan" : "Tambah"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case "Tentang":
        return <TentangSection data={aboutData} onEdit={openEditModal} />;

      case "Pengalaman":
        // Gunakan 'experience' dari hook
        return (
          <PengalamanSection
            data={experience}
            onAdd={() => openAddModal("Pengalaman")}
            onEdit={openEditModal}
          />
        );

      case "Pendidikan":
        return (
          <PendidikanSection
            data={education}
            onAdd={() => openAddModal("Pendidikan")}
            onEdit={openEditModal}
          />
        );

      case "Keahlian":
        // Gunakan 'skills' dari hook
        return (
          <KeahlianSection
            data={skills}
            onAdd={() => openAddModal("Keahlian")}
            onEdit={openEditModal}
          />
        );

      default:
        return <TentangSection data={aboutData} onEdit={openEditModal} />;
    }
  };

  const renderCategoryButtons = () => {
    return categories.map((item) => (
      <TouchableOpacity
        key={item}
        onPress={() => setSelectedCategory(item)}
        style={[
          styles.categoryButton,
          selectedCategory === item && styles.categoryButtonSelected,
          isDesktop && styles.desktopCategoryButton,
        ]}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === item && styles.categoryTextSelected,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ));
  };
  // Fungsi untuk mengubah string menjadi format "Capitalize Each Word"
  // Contoh: "tuna netra" -> "Tuna Netra" atau "tunanetra" -> "Tunanetra"
  const capitalizeEachWord = (str: string): string => {
    if (!str) return ""; // Menangani jika inputnya kosong
    return str
      .split(" ") // 1. Pecah string menjadi array kata (berdasarkan spasi)
      .map(
        (word) =>
          // 2. Untuk setiap kata, ubah huruf pertama menjadi besar + sisa huruf menjadi kecil
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" "); // 3. Gabungkan kembali array menjadi satu string
  };

  const disabilityStatus = capitalizeEachWord(
    profile?.job_seeker_users?.[0]?.disability || "Belum Diisi"
  );

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            Keyboard.dismiss();
            closeModal();
          }}
        >
          <TouchableWithoutFeedback>
            {renderModalContent()}
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isAddItemModalVisible}
        onRequestClose={() => setAddItemModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setAddItemModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.addModalContent}>
              <Text style={styles.modalTitle}>Tambah {modalType}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ketik disini..."
                placeholderTextColor="#8A8A8A"
                value={newItemText}
                onChangeText={setNewItemText}
                autoFocus={true}
              />
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddNewItemToList}
              >
                <Text style={styles.modalButtonText}>Tambah</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>

      <SafeAreaView style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.editButtonContainer}
            onPress={() => router.push("/profileEdit")} // atau "/profileEdit"
          >
            <FontAwesome6 name="edit" size={20} color="#1E88E5" />
          </TouchableOpacity>
          <View style={styles.profileCircle}>
            <Image
              source={{
                uri: profile?.avatar || "https://i.pravatar.cc/112",
              }}
              style={styles.profileImage}
            />
            <View style={styles.difableContainer}>
              <Text style={styles.difableText}>{disabilityStatus}</Text>
            </View>
          </View>

          <Text style={styles.nameText}>
            {profile?.full_name || "Nama Pengguna"}
          </Text>
          <View style={styles.containerNameFollow}>
            <Text style={styles.followText}>
              {profile?.job_seeker_users?.[0]?.biography ||
                "Bio belum diisi. Klik tombol edit untuk menambahkan."}
            </Text>
          </View>

          <Text style={styles.progressHeading}>Pantau Lamaran</Text>
          <Pressable
            style={styles.progressButton}
            onPress={() => router.push("/applications")}
          >
            <View style={styles.leftGroup}>
              <View style={styles.progressCircle} />
              <View style={styles.progressTextGroup}>
                <Text style={styles.progressJobText}>Web Developer</Text>
                <Text style={styles.progressText}>Review CV</Text>
              </View>
            </View>
          </Pressable>

          {isDesktop ? (
            // Layout untuk Desktop
            <View style={styles.desktopCategoryContainer}>
              {renderCategoryButtons()}
            </View>
          ) : (
            // Layout untuk Mobile (kode asli Anda)
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 16 }}
            >
              {renderCategoryButtons()}
            </ScrollView>
          )}

          {renderContent()}

          <View style={{ padding: 20 }}>
            <Text>Halo {user.email}, ini daftar aplikasimu 🎉</Text>
            <Button
              title="Logout"
              onPress={async () => {
                await supabase.auth.signOut();
                router.replace("/"); // balik ke home
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FBFFE4",
    paddingLeft: 20,
    paddingRight: 20,
  },

  profileCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: "#00A991",
    marginTop: 20,
    alignSelf: "center",
    position: "relative",
    marginBottom: 20,
    // overflow: "hidden", // Penting untuk memastikan gambar tidak keluar dari lingkaran
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 56,
  },
  difableContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: -12,
    backgroundColor: "#00A991",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  difableText: {
    fontWeight: 600,
    fontSize: 14,
    color: "#fbffe4",
  },

  containerNameFollow: {
    flexDirection: "row", // inline-flex jadi row
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    position: "relative",
  },

  nameText: {
    height: 24,
    fontSize: 16,
    color: "#262626",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 10,
  },

  rotatedline: {
    width: 36,
    height: 2,
    borderColor: "#00A991",
    borderWidth: 2,
    marginHorizontal: 11,
    transform: [{ rotate: "90deg" }],
  },

  followText: {
    // height: 36,
    // width: 60,
    fontSize: 12,
    color: "#262626",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    lineHeight: 18,
    flexShrink: 1,
  },

  progressHeading: {
    marginTop: 21,
    marginBottom: 6,
    width: 390,
    height: 22,
    fontSize: 16,
    fontWeight: 600,
    color: "#262626",
    textAlign: "left",
  },

  progressButton: {
    marginBottom: 16,
    width: "100%",
    height: 61,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 9,
    paddingVertical: 8,

    backgroundColor: "#00A991",
    borderRadius: 18,

    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#d9d9d9",
    marginRight: 13,
  },

  progressTextGroup: {
    marginRight: 176,
  },

  progressJobText: {
    fontSize: 14,
    color: "#262626",
  },

  progressText: {
    fontSize: 12,
    color: "#FBFFE4",
  },

  categoryButton: {
    paddingBottom: 4,
    flexGrow: 1,
    paddingTop: 2,
    width: "auto",
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#00A991", // emerald-500
    marginRight: 10,
    marginBottom: 8,
    backgroundColor: "#FBFFE4",
  },

  categoryText: {
    width: "auto",
    color: "#00A991",
    fontSize: 14,
    alignSelf: "center",
    paddingHorizontal: 22,
    textAlign: "center",
  },

  categoryButtonSelected: {
    backgroundColor: "#00A991",
  },

  categoryTextSelected: {
    color: "#FBFFE4",
  },

  containerContent: {
    marginTop: 0,
    width: "100%",
    height: "auto",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#00A991",
    borderRadius: 15,
  },

  titleContent: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FBFFE4",
    flex: 1,
  },

  textContent: {
    fontSize: 13,
    color: "#FBFFE4",
  },

  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  bullet: {
    color: "#FBFFE4",
    fontSize: 16,
    lineHeight: 20,
    marginRight: 6,
  },

  listItemText: {
    flex: 1,
    color: "#FBFFE4",
    fontSize: 13,
    lineHeight: 20,
  },

  infoCard: {
    backgroundColor: "#00A991",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  subtitleContent: {
    fontSize: 14,
    color: "#FBFFE4",
  },

  dateContent: {
    fontSize: 12,
    color: "#d9d9d9",
    marginTop: 2,
  },

  descriptionContent: {
    fontSize: 13,
    color: "#FBFFE4",
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: "#d9d9d9",
    paddingTop: 8,
  },

  editButton: {
    backgroundColor: "#d9d9d9",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },

  editButtonText: {
    color: "#262626",
    fontWeight: "600",
  },

  addButton: {
    backgroundColor: "#00A991",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(251, 255, 228, 0.2)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  addButtonText: {
    color: "#FBFFE4",
    fontSize: 16,
    fontWeight: "bold",
  },

  skillItemBar: {
    backgroundColor: "#00A991",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: "100%",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillItemText: {
    color: "#FBFFE4",
    fontSize: 16,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Latar belakang gelap
  },
  modalContent: {
    backgroundColor: "#FBFFE4",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    alignItems: "stretch",
    minHeight: 450,
    maxHeight: "80%", // Batasi tinggi maksimal agar tidak keluar layar
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: "#00A991",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    // width: '100%' tidak diperlukan lagi karena alignItems: 'stretch' pada parent
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  modalButton: {
    flex: 1, // PENTING: Membuat setiap tombol mengambil porsi ruang yang sama
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#FBFFE4",
    fontSize: 16,
    fontWeight: "600",
  },

  sectionContainer: {},

  centeredLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBFFE4",
  },
  modalButtonContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#00A991",
  },
  deleteButton: {
    backgroundColor: "#D32F2F", // Warna merah untuk aksi destruktif
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  listItemInModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 169, 145, 0.2)",
  },
  listItemTextInModal: {
    fontSize: 16,
    color: "#262626",
    flex: 1,
    marginRight: 8,
  },
  deleteItemButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  deleteItemButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  addButtonBlue: {
    backgroundColor: "#1E88E5", // Warna biru untuk "Tambah Data"
  },
  addModalContent: {
    backgroundColor: "#FBFFE4",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    alignItems: "stretch", // Agar input dan tombol meregang
  },
  emptyListText: {
    textAlign: "center",
    color: "#8A8A8A",
    marginVertical: 20,
    fontSize: 16,
  },

  desktopCategoryContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
    gap: 10,
  },
  desktopCategoryButton: {
    flex: 1,
    marginRight: 0,
  },

  container: {
    flex: 1,
  },

  editButtonContainer: {
    position: "absolute",
    top: 20,
    right: 20,

    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",

    justifyContent: "center",
    alignItems: "center",

    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
