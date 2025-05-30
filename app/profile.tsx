import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Profile() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text>Hallo semua</Text>
    </SafeAreaView>
  );


}
const styles = StyleSheet.create({
  mainContainer: {
    flex:1,
    backgroundColor: "#FBFFE4",
    alignItems: "center",
    justifyContent: "center",
  },
});