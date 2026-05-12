import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { Insight } from "@/features/insights/insights.interface";
import { RootStackParamList } from "@/core/navigation/root-navigator";

interface IrisInsightCardProps {
  insight: Insight | undefined;
  isLoading: boolean;
}

export default function IrisInsightCard({ insight, isLoading }: IrisInsightCardProps) {
  const colors = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (isLoading) return null;
  if (!insight) return null;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.primaryLight,
          borderColor: colors.primary + "33",
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Ionicons name="sparkles" size={13} color={colors.primary} />
        <Text
          style={[styles.label, { color: colors.primary, fontFamily: FONTS.bold }]}
        >
          IRIS NOTICED
        </Text>
      </View>

      <Text
        style={[
          styles.message,
          { color: colors.textPrimary, fontFamily: FONTS.semiBold },
        ]}
        numberOfLines={3}
      >
        {insight.message}
      </Text>

      <Pressable onPress={() => navigation.navigate("Insights")} style={styles.link}>
        <Text
          style={[styles.linkText, { color: colors.primary, fontFamily: FONTS.semiBold }]}
        >
          See the breakdown
        </Text>
        <Ionicons name="chevron-forward" size={13} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  label: { fontSize: 10, letterSpacing: 0.8 },
  message: {
    fontSize: FONT_SIZE.body + 1,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  link: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  linkText: { fontSize: 14 },
});
