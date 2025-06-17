import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

    const dummyApplications = [
    {
        id: "1",
        name: "Andi Wijaya",
        job: "Backend Developer",
        status: "Belum diproses",
    },
    {
        id: "2",
        name: "Siti Nurhaliza",
        job: "UI/UX Designer",
        status: "Sedang diproses",
    },
    {
        id: "3",
        name: "Budi Santoso",
        job: "QA Engineer",
        status: "Diterima",
    },
    {
        id: "4",
        name: "Rina Oktaviani",
        job: "Data Analyst",
        status: "Ditolak",
    },
    {
        id: "5",
        name: "Dimas Saputra",
        job: "Frontend Developer",
        status: "Belum diproses",
    },
    ];

    const HomePerusahaanDummy = () => {
    const [applications] = useState(dummyApplications);

    return (
        <SafeAreaProvider>
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Selamat datang, Perusahaan!</Text>
            <Text style={styles.subheading}>
            Lihat siapa saja yang melamar ke lowongan Anda.
            </Text>

            <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => router.push('/companies/applications')}
            >
            <Text style={styles.uploadButtonText}>+ Upload Lowongan Baru</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Daftar Pelamar</Text>

            <FlatList
            data={applications}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
                <View style={styles.card}>
                <Text style={styles.applicantName}>{item.name}</Text>
                <Text style={styles.jobApplied}>Lowongan: {item.job}</Text>
                <Text style={styles.status}>Status: {item.status}</Text>
                </View>
            )}
            />
        </ScrollView>
        </SafeAreaProvider>
    );
    };

    export default HomePerusahaanDummy;

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 32,
        backgroundColor: "#FFFFFF",
    },
    heading: {
        fontSize: 18,
        fontWeight: "bold",
    },
    subheading: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 12,
    },
    uploadButton: {
        backgroundColor: "#10B981",
        paddingVertical: 10,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 20,
    },
    uploadButtonText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
    card: {
        width: "48%",
        borderWidth: 1,
        borderColor: "#14B8A6",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
    },
    applicantName: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#000000",
    },
    jobApplied: {
        fontSize: 12,
        color: "#262626",
        marginTop: 4,
    },
    status: {
        fontSize: 12,
        marginTop: 4,
        color: "#10B981",
  },
});
