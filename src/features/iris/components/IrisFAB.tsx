import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { useIrisStore } from "../iris.state";

export default function IrisFAB() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const open = useIrisStore((s) => s.open);
  const isOpen = useIrisStore((s) => s.isOpen);

  // Don't render the FAB while the modal is open
  if (isOpen) return null;

  return (
    <View
      style={[
        styles.fab,
        {
          backgroundColor: colors.primary,
          bottom: insets.bottom + 80,
        },
      ]}
    >
      <Pressable
        onPress={open}
        hitSlop={8}
        android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
        style={styles.pressable}
      >
        <Ionicons name="sparkles" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
  },
});
