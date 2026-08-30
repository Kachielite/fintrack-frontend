import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { UserService } from "../user.service";
import { UserProfile } from "../user.interface";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface Props {
  visible: boolean;
  profile: UserProfile | undefined;
  onClose: () => void;
}

export default function EditNameSheet({ visible, profile, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Re-seed every time the sheet opens so a cancelled edit never lingers —
  // deliberately not depending on `profile` so an in-progress edit isn't
  // clobbered if the profile query happens to refetch while the sheet is open.
  useEffect(() => {
    if (!visible) return;
    setFirstName(profile?.firstName ?? "");
    setLastName(profile?.lastName ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const saveMutation = useMutation({
    mutationFn: () =>
      UserService.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
      onClose();
    },
  });

  const canSave = firstName.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={sheet.overlay}>
        <Pressable style={sheet.backdrop} onPress={onClose} />

        <DraggableSheet
          style={[sheet.panel, { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg }]}
          onClose={onClose}
          handleColor={colors.borderStrong}
        >
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={sheet.header}>
              <Text style={[sheet.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                Edit name
              </Text>
              <Pressable onPress={onClose} hitSlop={12} style={[sheet.closeBtn, { backgroundColor: colors.surface2 }]}>
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={sheet.body}>
              <View style={sheet.fieldGroup}>
                <Text style={[sheet.label, { color: colors.textSecondary, fontFamily: FONTS.semiBold }]}>
                  First name
                </Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Jane"
                  placeholderTextColor={colors.textSubtle}
                  autoCorrect={false}
                  style={[
                    sheet.input,
                    { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.textPrimary, fontFamily: FONTS.regular },
                  ]}
                />
              </View>

              <View style={sheet.fieldGroup}>
                <Text style={[sheet.label, { color: colors.textSecondary, fontFamily: FONTS.semiBold }]}>
                  Last name
                </Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  placeholderTextColor={colors.textSubtle}
                  autoCorrect={false}
                  style={[
                    sheet.input,
                    { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.textPrimary, fontFamily: FONTS.regular },
                  ]}
                />
              </View>

              <Pressable
                onPress={() => saveMutation.mutate()}
                disabled={!canSave || saveMutation.isPending}
                style={[
                  sheet.saveBtn,
                  { backgroundColor: canSave ? colors.primary : colors.surface2, opacity: saveMutation.isPending ? 0.7 : 1 },
                ]}
              >
                {saveMutation.isPending ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text style={[sheet.saveBtnText, { color: canSave ? colors.onPrimary : colors.textSubtle, fontFamily: FONTS.semiBold }]}>
                    Save changes
                  </Text>
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </DraggableSheet>
      </View>
    </Modal>
  );
}

const sheet = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  panel: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.88,
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
  closeBtn: { width: 34, height: 34, borderRadius: 99, alignItems: "center", justifyContent: "center" },
  body: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg, gap: SPACING.lg },
  fieldGroup: { gap: SPACING.xs },
  label: { fontSize: 13, letterSpacing: -0.1 },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: 14,
    height: 46,
  },
  saveBtn: {
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: { fontSize: 16 },
});
