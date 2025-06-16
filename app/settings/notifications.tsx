import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsSettings() {
  return (
    <>
      <SafeAreaView
        style={{ flex: 1, padding: 16, backgroundColor: "#f5f6fa" }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16 }}>Peluang Kerja</Text>
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              size={24}
              color="black"
            />
          </View>
          <Text style={{ fontSize: 16, color: "#737373" }}>
            Here you can manage your notification preferences.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16 }}>Lacak Lamaran Kerja</Text>
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              size={24}
              color="black"
            />
          </View>
          <Text style={{ fontSize: 16, color: "#737373" }}>
            Here you can manage your notification preferences.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16 }}>Pembaruan Aplikasi</Text>
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              size={24}
              color="black"
            />
          </View>
          <Text style={{ fontSize: 16, color: "#737373" }}>
            Here you can manage your notification preferences.
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}
