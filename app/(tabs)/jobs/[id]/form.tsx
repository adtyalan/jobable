import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../../utils/supabase';

const ApplicationForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  type ResumeAsset = {
    name: string;
    uri: string;
    mimeType: string;
    [key: string]: any;
  };
  const [resume, setResume] = useState<ResumeAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading submit

  const { id } = useLocalSearchParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
    async function fetchJob() {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*, companies(*)')
        .eq('id', id)
        .single();
      if (!error) setJob(data);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Ambil session user saat ini
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();
  }, []);

  // Fungsi untuk memilih file
  // Fungsi untuk memilih file (SUDAH DIPERBAIKI)
  const pickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });

      // Ganti pemeriksaan dari 'result.type === "success"' menjadi '!result.canceled'
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setResume(result.assets[0]);
        console.log('Resume terpilih:', result.assets[0]);
      } else {
        console.log('Pemilihan file dibatalkan atau gagal.');
      }
    } catch (error) {
      console.error('Terjadi error saat memilih dokumen:', error);
      // Anda bisa menampilkan pesan error kepada pengguna di sini jika perlu
    }
  };

  // Form validation
  function validate() {
    if (!name.trim() || !address.trim() || !phone.trim() || !email.trim()) {
      setError('Semua field wajib diisi.');
      return false;
    }
    if (!/^[0-9]+$/.test(phone)) {
      setError('Nomor telepon hanya boleh angka.');
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError('Format email tidak valid.');
      return false;
    }
    setError(null);
    return true;
  }

  // Submit handler (VERSI BARU)
  async function handleSubmit() {
    Keyboard.dismiss();
    setSuccess(null);
    setError(null);

    // 0. Validasi awal
    if (!validate()) return;
    if (!resume) {
      setError('Resume wajib diunggah.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Persiapkan file untuk diunggah
      // Menggunakan ekstensi file asli dari nama file
      const fileExt = resume.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `private/${fileName}`; // Folder 'private' di dalam bucket 'resumes'

      // Supabase di React Native memerlukan kita untuk mengubah URI file lokal menjadi format yang bisa diunggah
      // Kita bisa menggunakan fetch untuk mendapatkan file sebagai blob
      const response = await fetch(resume.uri);
      const blob = await response.blob();

      // 2. Unggah file ke Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('resumes') // Nama bucket yang Anda buat
        .upload(filePath, blob, {
          contentType: resume.mimeType,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Gagal mengunggah resume: ${uploadError.message}`);
      }

      // 3. Dapatkan URL publik dari file yang diunggah
      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Gagal mendapatkan URL publik untuk resume.');
      }
      const resumeUrl = urlData.publicUrl;

      // 4. Simpan semua data (termasuk URL resume) ke tabel 'applications'
      const { error: insertError } = await supabase.from('applications').insert([
        {
          job_id: job?.id,
          user_id: user?.id,
          name,
          address,
          phone,
          email,
          cv_url: resumeUrl, // <-- Simpan URL di sini
          status: 'pending',
        },
      ]);

      if (insertError) {
        throw new Error(`Gagal mengirim lamaran: ${insertError.message}`);
      }

      // 5. Reset form jika berhasil
      setSuccess('Lamaran berhasil dikirim!');
      setName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setResume(null); // Jangan lupa reset state resume
      setError(null);

      setTimeout(() => {
        router.replace('/'); // Kembali ke halaman utama setelah submit
      }, 1500);
    } catch (err: any) {
      // Tangkap semua jenis error (upload, get URL, insert)
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      // Pastikan loading state selalu kembali ke false
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.title}>Ajukan Lamaran</Text>
            </View>

            {/* Job Info */}
            <View style={styles.jobCard}>
              <View style={styles.logo}>
                {job?.companies?.logo ? (
                  <Image
                    source={{ uri: job.companies.logo }}
                    style={{ width: 40, height: 40, borderRadius: 8 }}
                    contentFit="contain"
                  />
                ) : (
                  <Text style={styles.logoIcon}>🔥</Text>
                )}
              </View>
              <View>
                <Text style={styles.jobTitle}>{job?.title || '-'}</Text>
                <Text style={styles.companyInfo}>
                  {job?.companies?.company_name || '-'} • {job?.location || '-'}
                </Text>
                <TouchableOpacity onPress={() => router.push(`/jobs/${job?.id}`)}>
                  <Text style={styles.detailLink}>Lihat detail pekerjaan</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form */}
            <Text style={styles.label}>Nama</Text>
            <TextInput
              style={[styles.input, { borderColor: '#737373' }]}
              placeholderTextColor="#999"
              placeholder="Contoh: Muhammad Abyan Aditya"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Alamat Rumah</Text>
            <TextInput
              style={[styles.input, { borderColor: '#737373' }]}
              placeholder="Contoh: Sekaran, Gunungpati, Semarang"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Nomor Telepon</Text>
            <View style={styles.phoneRow}>
              <TextInput
                style={[styles.codeInput, { borderColor: '#737373' }]}
                value="+62"
                editable={false}
              />
              <TextInput
                style={[styles.phoneInput, { borderColor: '#737373' }]}
                placeholder="Contoh: 81575624991"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.label}>Alamat Email</Text>
            <TextInput
              style={[styles.input, { borderColor: '#737373' }]}
              placeholder="Contoh: kamu@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Resume</Text>
            <TouchableOpacity
              style={[
                styles.uploadButton,
                resume && {
                  backgroundColor: '#00B388',
                  borderColor: '#00B388',
                },
              ]}
              onPress={pickResume}
            >
              <Ionicons
                name={resume ? 'checkmark-circle' : 'cloud-upload-outline'}
                size={18}
                color={resume ? '#fff' : '#00B388'}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.uploadText, resume && { color: '#fff', fontWeight: 'bold' }]}>
                {resume ? 'File Terunggah' : 'Unggah'}
              </Text>
            </TouchableOpacity>
            {resume && (
              <Text style={{ fontSize: 12, color: '#00B388', marginTop: 4 }}>{resume.name}</Text>
            )}

            <Text style={styles.footerNote}>
              Jaga diri Anda. Jangan sertakan informasi sensitif dalam dokumen anda.
            </Text>

            {error && <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text>}
            {success && <Text style={{ color: 'green', marginTop: 16 }}>{success}</Text>}
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && { backgroundColor: '#999' }, // Warna abu-abu saat loading
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting} // Nonaktifkan tombol saat loading
          >
            <Text style={styles.submitText}>{isSubmitting ? 'Mengirim...' : 'Ajukan'}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ApplicationForm;

// ...styles tetap sama...

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  jobCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 28,
  },
  jobTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  companyInfo: {
    fontSize: 12,
    color: '#666',
  },
  detailLink: {
    fontSize: 12,
    color: '#00B388',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  codeInput: {
    width: 60,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00B388',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    width: '100%',
  },
  uploadText: {
    marginLeft: 6,
    color: '#00B388',
    fontWeight: '600',
  },
  footerNote: {
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00B388',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
