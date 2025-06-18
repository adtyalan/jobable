    import { Ionicons } from "@expo/vector-icons";
    import { router } from "expo-router";
    import {
        Dimensions,
        Pressable,
        ScrollView,
        StyleSheet,
        Text,
        TouchableOpacity,
        View,
    } from "react-native";

    // Dummy jobs
    const jobs = [
    {
        title: "WebDev",
        status: "Aktif",
        datePosted: "25 Apr 2024",
        deadline: "25 Mei 2024",
        applicants: 20,
    },
    {
        title: "Mobile App Developer",
        status: "Aktif",
        datePosted: "20 Apr 2024",
        deadline: "20 Mei 2024",
        applicants: 12,
    },
    {
        title: "UX Designer",
        status: "Aktif",
        datePosted: "18 Apr 2024",
        deadline: "18 Mei 2024",
        applicants: 8,
    },
    {
        title: "Project Manager",
        status: "Nonaktif",
        datePosted: "15 Apr 2024",
        deadline: "15 Mei 2024",
        applicants: 5,
    },
    {
        title: "Data Analyst",
        status: "Aktif",
        datePosted: "10 Apr 2024",
        deadline: "10 Mei 2024",
        applicants: 17,
    },
    {
        title: "Backend Engineer",
        status: "Aktif",
        datePosted: "5 Apr 2024",
        deadline: "5 Mei 2024",
        applicants: 22,
    },
    {
        title: "Content Writer",
        status: "Nonaktif",
        datePosted: "1 Apr 2024",
        deadline: "1 Mei 2024",
        applicants: 9,
    },
    {
        title: "Quality Assurance",
        status: "Aktif",
        datePosted: "28 Mar 2024",
        deadline: "28 Apr 2024",
        applicants: 6,
    },
    {
        title: "Customer Support",
        status: "Aktif",
        datePosted: "25 Mar 2024",
        deadline: "25 Apr 2024",
        applicants: 14,
    },
    {
        title: "DevOps Engineer",
        status: "Aktif",
        datePosted: "22 Mar 2024",
        deadline: "22 Apr 2024",
        applicants: 11,
    },
    ];

    export default function EmployerDashboard() {
    return (
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.companyName}>🏢 PT Telkom Indonesia</Text>
            <TouchableOpacity style={styles.postButton}>
            <Text style={styles.postButtonText}>Pasang Lowongan</Text>
            </TouchableOpacity>
        </View>

        {/* Stat Cards */}
        <View style={styles.statsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <StatCard label="Lowongan aktif" value="4" />
            <StatCard label="Lamaran masuk" value="75" />
            <StatCard
                label="Pelamar disabilitas"
                value="50"
                icon={<Ionicons name="bar-chart" size={20} color="white" />}
            />
            <StatCard label="Diproses" value="10" />
            </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Lowongan yang Dipasang</Text>

        {/* Job List */}
        <ScrollView style={styles.jobList} showsVerticalScrollIndicator={false}>
            {jobs.map((job, idx) => (
            <Pressable
                key={idx}
                style={styles.jobCard}
                onPress={() => router.push("/companies/applications")}
            >
                <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text
                    style={[
                    styles.status,
                    {
                        backgroundColor:
                        job.status === "Aktif" ? "#009688" : "#b0bec5",
                    },
                    ]}
                >
                    {job.status}
                </Text>
                </View>
                <Text>{job.applicants} pelamar</Text>
                <Text>
                {job.datePosted} - {job.deadline}
                </Text>
                <View style={styles.actionRow}>
                <Text style={styles.action}>Edit</Text>
                <Text style={styles.action}>Nonaktifkan</Text>
                <Text style={[styles.action, { color: "#00796b" }]}>
                    Lihat Pelamar
                </Text>
                </View>
            </Pressable>
            ))}
        </ScrollView>
        </View>
    );
    }

    function StatCard({ label, value, icon }) {
    return (
        <View style={styles.statCard}>
        <View style={styles.statTopRow}>
            {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
            <Text style={styles.statValue}>{value}</Text>
        </View>
        <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fffbe6",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    companyName: {
        fontWeight: "bold",
        fontSize: 18,
    },
    postButton: {
        backgroundColor: "#009688",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    postButtonText: {
        color: "#fff",
    },
    statsContainer: {
        marginVertical: 16,
    },
    statCard: {
        backgroundColor: "#00bfa5",
        padding: 12,
        borderRadius: 10,
        width: 90,
        marginRight: 10,
    },
    statTopRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    statValue: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#fff",
    },
    statLabel: {
        color: "#fff",
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    jobList: {
        maxHeight: Dimensions.get("window").height * 0.65,
    },
    jobCard: {
        padding: 12,
        backgroundColor: "#e0f2f1",
        borderRadius: 8,
        marginBottom: 12,
    },
    jobHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    status: {
        color: "white",
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    action: {
        color: "#00796b",
    },
    });
