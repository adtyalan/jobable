import { useUserProfile } from '@/hooks/ProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';

export default function EmployerDashboard() {
  const { user, profile, loading } = useUserProfile();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchJobs(user.id);
    }
  }, [user]);

  async function fetchJobs(companyId: string) {
    setLoadingJobs(true);
    const { data, error } = await supabase.from('jobs').select('*').eq('company_id', companyId);
    if (!error) setJobs(data || []);
    setLoadingJobs(false);
  }

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>🏢 {profile?.full_name || 'Perusahaan'}</Text>
          <TouchableOpacity style={styles.postButton}>
            <Text style={styles.postButtonText}>Pasang Lowongan</Text>
          </TouchableOpacity>
        </View>

        {/* Stat Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.bentoGrid}>
            <StatCard
              label="Lowongan aktif"
              value={jobs.filter((j) => j.status === 'Aktif').length}
            />
            <StatCard label="Lamaran masuk" value="75" />
            <StatCard
              label="Pelamar disabilitas"
              value="50"
              icon={<Ionicons name="bar-chart" size={20} color="white" />}
            />
            <StatCard label="Diproses" value="10" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Lowongan yang Dipasang</Text>

        {/* Job List */}
        <View style={styles.jobList}>
          {loadingJobs ? (
            <Text>Memuat data...</Text>
          ) : jobs.length === 0 ? (
            <Text>Tidak ada lowongan.</Text>
          ) : (
            jobs.map((job) => (
              <Pressable
                key={job.id}
                style={styles.jobCard}
                onPress={() => router.push(`./jobList/${job?.id}`)}
              >
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text
                    style={[
                      styles.status,
                      {
                        backgroundColor: job.is_open === true ? '#009688' : '#b0bec5',
                      },
                    ]}
                  >
                    {job.status}
                  </Text>
                </View>
                <Text style={{ color: 'grey' }}>{job.type}</Text>
                <Text>{job.description}</Text>
                <Text>{job.location}</Text>
                <View style={styles.actionRow}>
                  <Text style={styles.action}>Edit</Text>
                  <Text style={styles.action}>Nonaktifkan</Text>
                  <Text style={[styles.action, { color: '#00796b' }]}>Lihat Pelamar</Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

type StatCardProps = {
  label: any;
  value: any;
  icon?: React.ReactNode;
};

function StatCard({ label, value, icon }: StatCardProps) {
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
    backgroundColor: '#fffbe6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  postButton: {
    backgroundColor: '#009688',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  postButtonText: {
    color: '#fff',
  },
  statsContainer: {
    marginVertical: 16,
    width: '100%',
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 0,
  },
  statCard: {
    backgroundColor: '#00bfa5',
    padding: 18,
    borderRadius: 18,
    width: '45%',
    marginBottom: 14,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
  statLabel: {
    color: '#fff',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  jobList: { marginBottom: 16 },
  jobCard: {
    padding: 12,
    backgroundColor: '#e0f2f1',
    borderRadius: 8,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    color: 'white',
    width: 24,
    height: 24,
    borderRadius: 100,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  action: {
    color: '#00796b',
  },
});
