import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Definisikan tipe dan data di sini atau impor dari file lain
export enum ProgressStatus {
  Clear = "clear",
  Current = "current",
  NotProgress = "not_progress",
}

export type TimelineItemData = {
  title: string;
  description: string;
  status: ProgressStatus;
};

const timelineData: TimelineItemData[] = [
  {
    title: "Unggah Dokumen",
    description: "Pengguna telah mengirim lamaran ke perusahaan.",
    status: ProgressStatus.Clear,
  },
  {
    title: "Dokumen Diverifikasi",
    description:
      "Sistem atau admin memeriksa kelengkapan dokumen seperti CV, surat lamaran, portofolio, dan bukti pendukung disabilitas (jika diperlukan untuk akomodasi kerja).",
    status: ProgressStatus.Clear,
  },
  {
    title: "Review CV",
    description:
      "Tim HR membaca dan mengevaluasi CV serta dokumen yang dikirim.",
    status: ProgressStatus.Current,
  },
  {
    title: "Wawancara 1",
    description: "Pengenalan dan pertanyaan umum.",
    status: ProgressStatus.NotProgress,
  },
  {
    title: "Wawancara 2",
    description:
      "Fokus pada keahlian dan kesiapan kerja. Bisa dilakukan secara daring atau luring.",
    status: ProgressStatus.NotProgress,
  },
  {
    title: "Pengumuman Hasil Akhir",
    description: "",
    status: ProgressStatus.NotProgress,
  },
];

// Komponen untuk satu item di timeline
type StepItemProps = {
  item: TimelineItemData;
  isLast: boolean;
};

const StepItem: React.FC<StepItemProps> = ({ item, isLast }) => {
  const renderIcon = () => {
    switch (item.status) {
      case ProgressStatus.Clear:
        return (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="#90BE2E"
          />
        );
      case ProgressStatus.Current:
        return (
          <MaterialCommunityIcons
            name="record-circle-outline"
            size={24}
            color="#90BE2E"
          />
        );
      case ProgressStatus.NotProgress:
      default:
        return (
          <MaterialCommunityIcons
            name="checkbox-blank-circle-outline"
            size={24}
            color="#999999"
          />
        );
    }
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconColumn}>
        {!isLast && <View style={styles.dottedLine} />}
        {renderIcon()}
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.titleText}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.descriptionText}>{item.description}</Text>
        ) : null}
      </View>
    </View>
  );
};

// Komponen Utama
const ProgressTracker = () => {
  return (
    <>
      {timelineData.map((item, index) => (
        <StepItem
          key={item.title}
          item={item}
          isLast={index === timelineData.length - 1}
        />
      ))}
    </>
  );
};

// StyleSheet
const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  iconColumn: {
    width: 30,
    alignItems: "center",
    position: "relative",
  },
  dottedLine: {
    position: "absolute",
    top: 24,
    bottom: -10,
    left: "50%",
    borderLeftWidth: 2,
    borderColor: "#90BE2E",
    borderStyle: "dotted",
  },
  textColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#262626",
    lineHeight: 20,
  },
});

export default ProgressTracker;
