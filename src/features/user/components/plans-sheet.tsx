import React from "react";
import { Modal, View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const PLANS = [
  {
    key: "free",
    label: "Free",
    price: null,
    description: "Get started with essential tracking",
    features: [
      "1 email connection",
      "100 transactions / month",
      "Basic AI insights",
      "Single reference currency",
      "Community support",
    ],
  },
  {
    key: "pro",
    label: "Pro",
    price: "$9.99 / mo",
    description: "For the serious money manager",
    features: [
      "Unlimited email connections",
      "Unlimited transactions",
      "Advanced AI insights with charts",
      "Multi-currency tracking",
      "Budget recommendations",
      "Priority support",
    ],
  },
  {
    key: "business",
    label: "Business",
    price: "$24.99 / mo",
    description: "For teams and business expenses",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Business expense reports",
      "Custom categories",
      "API access",
      "Dedicated support",
    ],
  },
];

interface Props {
  visible: boolean;
  currentTier: string;
  onClose: () => void;
}

export default function PlansSheet({ visible, currentTier, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={sheetStyles.overlay}>
        <Pressable style={sheetStyles.backdrop} onPress={onClose} />
        <View
          style={[
            sheetStyles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + SPACING.lg,
              maxHeight: SCREEN_HEIGHT * 0.92,
            },
          ]}
        >
          <View style={[sheetStyles.handle, { backgroundColor: colors.borderStrong }]} />
          <View style={sheetStyles.header}>
            <Text style={[sheetStyles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              Plans
            </Text>
            <Pressable onPress={onClose} hitSlop={12} style={[sheetStyles.closeBtn, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{
              paddingHorizontal: SPACING.xl,
              gap: SPACING.md,
              paddingBottom: SPACING.lg,
            }}
            showsVerticalScrollIndicator={false}
          >
            {PLANS.map((plan) => {
              const isCurrent = plan.key === currentTier;
              const isHighlighted = plan.key === "pro";
              return (
                <View
                  key={plan.key}
                  style={[
                    planStyles.card,
                    {
                      backgroundColor: isHighlighted ? colors.primaryLight : colors.surface2,
                      borderColor: isHighlighted ? colors.primary : colors.border,
                      borderWidth: isHighlighted ? 1.5 : 1,
                    },
                  ]}
                >
                  <View style={planStyles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <View style={planStyles.labelRow}>
                        <Text style={[planStyles.planLabel, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                          {plan.label}
                        </Text>
                        {isCurrent && (
                          <View style={[planStyles.currentBadge, { backgroundColor: colors.primary }]}>
                            <Text style={[planStyles.currentText, { color: colors.onPrimary, fontFamily: FONTS.bold }]}>
                              Current
                            </Text>
                          </View>
                        )}
                        {isHighlighted && !isCurrent && (
                          <View style={[planStyles.currentBadge, { backgroundColor: colors.primary }]}>
                            <Text style={[planStyles.currentText, { color: colors.onPrimary, fontFamily: FONTS.bold }]}>
                              Popular
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[planStyles.planDesc, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                        {plan.description}
                      </Text>
                    </View>
                    <Text
                      style={[
                        planStyles.price,
                        { color: plan.price ? colors.primary : colors.textSubtle, fontFamily: FONTS.bold },
                      ]}
                    >
                      {plan.price ?? "Free"}
                    </Text>
                  </View>

                  <View style={[planStyles.divider, { backgroundColor: colors.border }]} />

                  <View style={{ gap: SPACING.xs }}>
                    {plan.features.map((f) => (
                      <View key={f} style={planStyles.featureRow}>
                        <Ionicons name="checkmark-circle" size={15} color={colors.primary} />
                        <Text style={[planStyles.featureText, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
                          {f}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {!isCurrent && (
                    <Pressable
                      style={[
                        planStyles.upgradeBtn,
                        { backgroundColor: isHighlighted ? colors.primary : colors.surface },
                        { borderColor: colors.border },
                      ]}
                    >
                      <Text
                        style={[
                          planStyles.upgradeText,
                          { color: isHighlighted ? colors.onPrimary : colors.textPrimary, fontFamily: FONTS.semiBold },
                        ]}
                      >
                        {plan.key === "free" ? "Downgrade" : "Coming soon"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const sheetStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 99,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
});

const planStyles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    gap: SPACING.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: 4,
  },
  planLabel: { fontSize: 17, letterSpacing: -0.3 },
  planDesc: { fontSize: 13, lineHeight: 18 },
  price: { fontSize: 16, letterSpacing: -0.3 },
  currentBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  currentText: { fontSize: 10, letterSpacing: 0.4 },
  divider: { height: StyleSheet.hairlineWidth },
  featureRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  featureText: { fontSize: 13, lineHeight: 18 },
  upgradeBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.sm + 2,
    alignItems: "center",
    borderWidth: 1,
    marginTop: SPACING.xs,
  },
  upgradeText: { fontSize: 14 },
});
