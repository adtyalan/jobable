import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../utils/supabase';

export default function JobDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobAndApplicants(id as string);
    }
  }, [id]);

  async function fetchJobAndApplicants(jobId: string) {
    setLoading(true);

    // Fetch job detail
    const { data: jobData } = await supabase.from('jobs').select('*').eq('id', jobId).single();

    // Fetch applications
    const { data: apps } = await supabase
      .from('applications')
      .select('*, job_seeker_users(*)')
      .eq('job_id', jobId);

    setJob(jobData || null);
    setApplicants(apps || []);
    setLoading(false);
  }

  async function handleUpdateStatus(status: 'accepted' | 'rejected') {
    if (!selectedApplicant) return;
    setUpdating(true);
    await supabase.from('applications').update({ status }).eq('id', selectedApplicant.id);

    // Refresh data
    await fetchJobAndApplicants(id as string);
    setUpdating(false);
    setModalVisible(false);
    setSelectedApplicant(null);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending':
        return { color: '#ff9800' };
      case 'accepted':
        return { color: '#4caf50' };
      case 'rejected':
        return { color: '#f44336' };
      default:
        return { color: '#999' };
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#009688" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {/* Tombol Kembali */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.jobCard}>
            <Text style={styles.title}>{job?.title}</Text>
            <Text
              style={[styles.status, { backgroundColor: job?.is_open ? '#009688' : '#b0bec5' }]}
            >
              {job?.is_open ? 'Aktif' : 'Tidak Aktif'}
            </Text>
            <Text style={styles.info}>📅 Dibuat: {job?.created_at?.slice(0, 10)}</Text>
            <Text style={styles.info}>🏢 Tipe: {job?.type}</Text>
            <View style={styles.divider} />
            <Text style={[styles.subheading, { paddingTop: 10 }]}>Deskripsi Pekerjaan</Text>
            <Text style={styles.description}>
              {job?.description || 'Deskripsi pekerjaan belum tersedia.'}
            </Text>
          </View>

          {/* Statistik */}
          <View style={styles.statCard}>
            <Text style={styles.subheading}>📈 Statistik Pelamar</Text>
            <Text style={styles.info}>{applicants.length} orang telah mendaftar</Text>
          </View>

          {/* Modal Konfirmasi */}
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.3)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 24,
                  width: 300,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                  Konfirmasi
                </Text>
                <Text style={{ marginBottom: 20, textAlign: 'center' }}>
                  Apakah Anda ingin menerima pelamar ini?
                </Text>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <TouchableOpacity
                    style={[styles.cvButton, { backgroundColor: '#4caf50' }]}
                    disabled={updating}
                    onPress={() => handleUpdateStatus('accepted')}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Iya</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cvButton, { backgroundColor: '#f44336' }]}
                    disabled={updating}
                    onPress={() => handleUpdateStatus('rejected')}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tidak</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Pelamar */}
          <Text style={styles.subheading}>🧑‍💻 Daftar Pelamar</Text>
          {applicants.length === 0 ? (
            <Text style={{ color: '#888', marginBottom: 16 }}>Belum ada pelamar.</Text>
          ) : (
            applicants.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.applicantCard}
                onPress={() => {
                  setSelectedApplicant(item);
                  setModalVisible(true);
                }}
              >
                <View style={styles.leftSection}>
                  <Text style={styles.applicantName}>{item.name || 'Tanpa Nama'}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tanggal:</Text>
                    <Text style={styles.infoValue}>{item.applied_at?.slice(0, 10) || '-'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Asal:</Text>
                    <Text style={styles.infoValue}>{item.address || '-'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{item.email || '-'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Telepon:</Text>
                    <Text style={styles.infoValue}>{item.phone || '-'}</Text>
                  </View>
                  <Text style={styles.badge}>{item.job_seeker_users?.disability || '-'}</Text>
                </View>
                <View style={styles.rightSection}>
                  <Text style={[styles.statusText, getStatusColor(item.status)]}>
                    {item.status}
                  </Text>
                  {item.cv_url ? (
                    <TouchableOpacity
                      style={styles.cvButton}
                      onPress={() => Linking.openURL(item.cv_url)}
                    >
                      <Ionicons name="document-outline" size={16} color="#00796b" />
                      <Text style={styles.cvButtonText}>Lihat CV</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.badge}>CV tidak tersedia</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7fefe',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
    fontWeight: '500',
  },
  jobCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#263238',
  },
  status: {
    marginTop: 8,
    alignSelf: 'flex-start',
    width: 'auto',
    padding: 6,
    color: '#fff',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    marginTop: 6,
    color: '#555',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#37474f',
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    color: '#444',
    lineHeight: 20,
    textAlign: 'justify',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 16,
  },
  statCard: {
    backgroundColor: '#e0f7fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  applicantCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 2,
  },
  applicantName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#212121',
  },
  badge: {
    backgroundColor: '#b2dfdb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginVertical: 4,
    fontSize: 12,
    color: '#004d40',
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 80,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 6,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cvButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  cvButtonText: {
    color: '#00796b',
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    minWidth: 60,
  },
  infoValue: {
    fontSize: 13,
    color: '#222',
    marginLeft: 4,
    flexShrink: 1,
  },
});
