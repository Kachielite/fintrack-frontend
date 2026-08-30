import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { Insight } from "@/features/insights/insights.interface";
import InsightReportDetail from "@/features/insights/components/insight-report-detail";
import { formatPeriodLabel } from "@/features/insights/insights.utils";
import { RootStackParamList } from "@/core/navigation/root-navigator";

interface IrisInsightCardProps {
  insight: Insight | undefined;
  isLoading: boolean;
}

export default function IrisInsightCard({ insight, isLoading }: IrisInsightCardProps) {
  const colors = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [expanded, setExpanded] = useState(false);

  if (isLoading) return null;
  if (!insight) return null;

  const detail = insight.contextData?.headline ? insight.contextData : null;
  const periodLabel = formatPeriodLabel(insight);

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
          style={[
            styles.label,
            { color: colors.primary, fontFamily: FONTS.bold },
          ]}
        >
          IRIS NOTICED
        </Text>
        <View style={{ flex: 1 }} />
        {periodLabel && (
          <Text
            style={[styles.periodLabel, { color: colors.textSubtle, fontFamily: FONTS.medium }]}
          >
            {periodLabel}
          </Text>
        )}
      </View>

      {expanded && detail ? (
        <InsightReportDetail detail={detail} />
      ) : (
        <Text
          style={[
            styles.message,
            { color: colors.textPrimary, fontFamily: FONTS.semiBold },
          ]}
          numberOfLines={3}
        >
          {insight.message}
        </Text>
      )}

      <View style={styles.actionsRow}>
        {detail ? (
          <Pressable onPress={() => setExpanded((v) => !v)} style={styles.link} hitSlop={8}>
            <Text
              style={[
                styles.linkText,
                { color: colors.primary, fontFamily: FONTS.semiBold },
              ]}
            >
              {expanded ? "Show less" : "Read more"}
            </Text>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={13}
              color={colors.primary}
            />
          </Pressable>
        ) : (
          <View />
        )}

        <Pressable
          onPress={() => (navigation as any).navigate("Tabs", { screen: "Budget" })}
          style={styles.link}
          hitSlop={8}
        >
          <Text
            style={[
              styles.linkText,
              { color: colors.primary, fontFamily: FONTS.semiBold },
            ]}
          >
            See full report
          </Text>
          <Ionicons name="chevron-forward" size={13} color={colors.primary} />
        </Pressable>
      </View>
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
  periodLabel: { fontSize: 11 },
  message: {
    fontSize: FONT_SIZE.body + 1,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  link: { flexDirection: "row", alignItems: "center", gap: 4 },
  linkText: { fontSize: 14 },
});
