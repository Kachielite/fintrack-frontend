import React, { useState } from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { CompleteOnboardingSchemaType } from "../onboarding.dto";

type Currency = CompleteOnboardingSchemaType["ref_currency"];

const CURRENCIES: Array<{ code: Currency; name: string; symbol: string }> = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
];

interface Props {
  value: Currency;
  onChange: (v: Currency) => void;
}

export default function CurrencySelector({ value, onChange }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const current = CURRENCIES.find((c) => c.code === value);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
        What's your main currency?
      </Text>

      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.triggerLabel, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
          {current ? `${current.symbol} ${current.code}` : value}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textSubtle} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                Main currency
              </Text>
              <Pressable
                onPress={() => setOpen(false)}
                hitSlop={12}
                style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView
              style={{ flexShrink: 1 }}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            >
              {CURRENCIES.map((c) => {
                const active = c.code === value;
                return (
                  <Pressable
                    key={c.code}
                    onPress={() => {
                      onChange(c.code);
                      setOpen(false);
                    }}
                    style={[
                      styles.row,
                      {
                        backgroundColor: active ? colors.primaryLight : colors.surface2,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <View style={[styles.symbolBadge, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.symbol, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                        {c.symbol}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.code,
                          { color: active ? colors.primary : colors.textPrimary, fontFamily: FONTS.semiBold },
                        ]}
                      >
                        {c.code}
                      </Text>
                      <Text style={[styles.name, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                        {c.name}
                      </Text>
                    </View>
                    {active && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: { fontSize: 14, marginBottom: 10 },
  trigger: {
    height: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  triggerLabel: { fontSize: 15 },

  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "75%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  title: { fontSize: FONT_SIZE.h3 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
  },
  symbolBadge: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: { fontSize: 15 },
  code: { fontSize: 15, letterSpacing: -0.2 },
  name: { fontSize: 12, marginTop: 1 },
});
