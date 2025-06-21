import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/supabase";

const disabilityCategories = ["tunanetra", "tunarungu", "tunadaksa", "tunawicara"];

const UploadJob = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [salary, setSalary] = useState("");
    const [type, setType] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        Keyboard.dismiss();
        setError(null);
        setSuccess(null);

        if (!title || !description || !location || !category || !type) {
            setError("Semua field wajib diisi, kecuali gaji.");
            return;
        }

        if (!disabilityCategories.includes(category)) {
            setError("Kategori disabilitas tidak valid.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { data: sessionData } = await supabase.auth.getUser();
            const company_id = sessionData?.user?.id;

            const { error: insertError } = await supabase.from("jobs").insert([{
                title,
                description,
                location,
                category,
                salary: salary ? parseFloat(salary) : null,
                type,
                company_id,
            }]);

            if (insertError) throw insertError;

            setSuccess("Lowongan berhasil ditambahkan!");
            setTitle("");
            setDescription("");
            setLocation("");
            setCategory("");
            setSalary("");
            setType("");

            setTimeout(() => router.replace("/"), 1500);
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                        <View style={styles.headerDecoration} />
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={24} color="#00695C" />
                            </TouchableOpacity>
                            <Text style={styles.title}>Tambah Lowongan Baru</Text>
                        </View>

                        <View style={styles.illustrationContainer}>
                            <Ionicons name="briefcase" size={60} color="#00796B" />
                        </View>

                        <View style={styles.formCard}>
                            <Field label="Judul Pekerjaan" icon="briefcase-outline">
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contoh: Backend Developer"
                                    placeholderTextColor="#999"
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </Field>

                            <Field label="Deskripsi" icon="document-text-outline">
                                <TextInput
                                    style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                                    multiline
                                    placeholder="Jelaskan tugas dan tanggung jawab pekerjaan..."
                                    placeholderTextColor="#999"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </Field>

                            <Field label="Lokasi" icon="location-outline">
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contoh: Jakarta, Indonesia"
                                    placeholderTextColor="#999"
                                    value={location}
                                    onChangeText={setLocation}
                                />
                            </Field>

                            <Field label="Kategori Disabilitas" icon="layers-outline">
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={category}
                                        onValueChange={(itemValue) => setCategory(itemValue)}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Pilih kategori disabilitas..." value="" />
                                        {disabilityCategories.map((cat) => (
                                            <Picker.Item key={cat} label={cat} value={cat} />
                                        ))}
                                    </Picker>
                                </View>
                            </Field>

                            <Field label="Gaji (opsional)" icon="cash-outline">
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contoh: 7000000"
                                    placeholderTextColor="#999"
                                    value={salary}
                                    onChangeText={setSalary}
                                    keyboardType="numeric"
                                />
                            </Field>

                            <Field label="Tipe Pekerjaan" icon="time-outline">
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contoh: Full-time, Freelance"
                                    placeholderTextColor="#999"
                                    value={type}
                                    onChangeText={setType}
                                />
                            </Field>

                            {error && <Text style={styles.error}>{error}</Text>}
                            {success && <Text style={styles.success}>{success}</Text>}
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && { backgroundColor: "#AAA" }]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.submitText}>
                            {isSubmitting ? "Mengirim..." : "Tambah Lowongan"}
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default UploadJob;

function Field({
    label,
    icon,
    children,
}: {
    label: string;
    icon: any;
    children: any;
}) {
    return (
        <View style={{ marginBottom: 18 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                <Ionicons name={icon} size={16} color="#00796B" style={{ marginRight: 6 }} />
                <Text style={{ fontWeight: "600", color: "#004D40", fontSize: 14 }}>{label}</Text>
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FBFFE4",
    },
    scroll: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 140,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    headerDecoration: {
        height: 100,
        backgroundColor: "#E0F2F1",
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#00796B",
    },
    illustrationContainer: {
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    formCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    input: {
        backgroundColor: "#F1F8F7",
        borderWidth: 1,
        borderColor: "#B2DFDB",
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#B2DFDB",
        borderRadius: 10,
        backgroundColor: "#F1F8F7",
        overflow: "hidden",
    },
    picker: {
        height: 50,
        width: "100%",
        color: "#333",
    },
    error: {
        marginTop: 16,
        color: "red",
        fontSize: 14,
    },
    success: {
        marginTop: 16,
        color: "green",
        fontSize: 14,
    },
    submitButton: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: "#00A991",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 4,
    },
    submitText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
