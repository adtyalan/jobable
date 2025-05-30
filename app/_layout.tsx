import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="applications" options={{ title: "Applications" }} />
      <Tabs.Screen name="comunity" options={{title: "Komunitas"}}/>
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
