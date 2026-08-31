import React, { useState } from "react";
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DraggableSheet from "./DraggableSheet";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";

export interface DropdownOption {
  value: string;
  label: string;
  sub?: string;
}

interface Props {
  label: string;
  placeholder: string;
  value: string | null;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

// Generic tap-to-open bottom sheet dropdown. Renders as its own Modal, so it
// works fine nested inside another already-open sheet.
export default function Dropdown({ label, placeholder, value, options, onSelect, disabled }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  function handleSelect(v: string) {
    onSelect(v);
    setOpen(false);
  }

  return (
    <View style={{ gap: SPACING.sm }}>
      <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
        {label}
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        style={[
          styles.trigger,
          { backgroundColor: colors.background, borderColor: colors.border, opacity: disabled ? 0.5 : 1 },
        ]}
      >
        <Text
          style={[
            styles.triggerLabel,
            { color: selected ? colors.textPrimary : colors.textSubtle, fontFamily: FONTS.semiBold },
          ]}
          numberOfLines={1}
        >
          {selected?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textSubtle} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <DraggableSheet
            style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg }]}
            onClose={() => setOpen(false)}
            handleColor={colors.borderStrong}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                {label}
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
              style={{ maxHeight: 360 }}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            >
              {options.map((o) => {
                const active = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    onPress={() => handleSelect(o.value)}
                    style={[
                      styles.row,
                      {
                        backgroundColor: active ? colors.primaryLight : colors.background,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.rowLabel, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                        {o.label}
                      </Text>
                      {o.sub ? (
                        <Text style={[styles.rowSub, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                          {o.sub}
                        </Text>
                      ) : null}
                    </View>
                    {active && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </DraggableSheet>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, letterSpacing: 0.6 },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
  },
  triggerLabel: { fontSize: 15, flex: 1 },
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: { fontSize: FONT_SIZE.h3 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl, gap: SPACING.xs },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  rowLabel: { fontSize: 14 },
  rowSub: { fontSize: 11, marginTop: 1 },
});
