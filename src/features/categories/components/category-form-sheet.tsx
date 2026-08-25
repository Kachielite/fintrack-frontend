import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/use-category-mutations";
import { ICategory } from "../categories.interface";

const ICON_CHOICES: React.ComponentProps<typeof Ionicons>["name"][] = [
  "pricetag-outline",
  "star-outline",
  "heart-outline",
  "briefcase-outline",
  "home-outline",
  "car-outline",
  "gift-outline",
  "book-outline",
  "fitness-outline",
  "paw-outline",
  "cafe-outline",
  "cart-outline",
  "medkit-outline",
  "game-controller-outline",
  "musical-notes-outline",
  "camera-outline",
  "airplane-outline",
  "bicycle-outline",
  "football-outline",
  "flower-outline",
];

interface Props {
  visible: boolean;
  onClose: () => void;
  category?: ICategory | null;
}

export default function CategoryFormSheet({
  visible,
  onClose,
  category,
}: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const isEditing = !!category;

  const { createCategory, isCreating } = useCreateCategory();
  const { updateCategory, isUpdating } = useUpdateCategory();
  const { deleteCategory, isDeleting } = useDeleteCategory();

  const [name, setName] = useState(category?.name ?? "");
  const [icon, setIcon] = useState<string>(category?.icon ?? ICON_CHOICES[0]);
  const [type, setType] = useState<"expense" | "income">(
    (category?.type as "expense" | "income") ?? "expense",
  );

  function resetAndClose() {
    setName("");
    setIcon(ICON_CHOICES[0]);
    setType("expense");
    onClose();
  }

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert("Name required", "Give this category a name.");
      return;
    }
    try {
      if (isEditing && category) {
        await updateCategory({
          id: category.id,
          payload: { name: name.trim(), icon, type },
        });
        Toast.show({ type: "success", text1: "Category updated" });
      } else {
        await createCategory({ name: name.trim(), icon, type });
        Toast.show({ type: "success", text1: "Category created" });
      }
      resetAndClose();
    } catch {
      Toast.show({
        type: "error",
        text1: isEditing
          ? "Could not update category"
          : "Could not create category",
      });
    }
  }

  function handleDelete() {
    if (!category) return;
    Alert.alert(
      "Delete category?",
      `"${category.name}" will be removed. This only works if no transaction uses it.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(category.id);
              Toast.show({ type: "success", text1: "Category deleted" });
              resetAndClose();
            } catch (err) {
              const message =
                (err as { response?: { data?: { message?: string } } })
                  ?.response?.data?.message ?? "Could not delete category";
              Toast.show({ type: "error", text1: message });
            }
          },
        },
      ],
    );
  }

  const isBusy = isCreating || isUpdating || isDeleting;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={resetAndClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={resetAndClose} />
        <DraggableSheet
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, paddingBottom: insets.bottom },
          ]}
          onClose={resetAndClose}
          handleColor={colors.borderStrong}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontFamily: FONTS.bold },
                ]}
              >
                {isEditing ? "Edit Category" : "New Category"}
              </Text>
              <Pressable
                onPress={resetAndClose}
                hitSlop={12}
                style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontFamily: FONTS.bold },
                  ]}
                >
                  NAME
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Kids' School Fees"
                  placeholderTextColor={colors.textSubtle}
                  style={[
                    styles.textInput,
                    {
                      color: colors.textPrimary,
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                />
              </View>

              <View style={styles.section}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontFamily: FONTS.bold },
                  ]}
                >
                  TYPE
                </Text>
                <View style={styles.typeRow}>
                  {(["expense", "income"] as const).map((t) => {
                    const active = type === t;
                    return (
                      <Pressable
                        key={t}
                        onPress={() => setType(t)}
                        style={[
                          styles.typeBtn,
                          {
                            backgroundColor: active
                              ? colors.primaryLight
                              : colors.background,
                            borderColor: active
                              ? colors.primary
                              : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeLabel,
                            {
                              color: active
                                ? colors.primary
                                : colors.textPrimary,
                              fontFamily: FONTS.semiBold,
                            },
                          ]}
                        >
                          {t === "expense" ? "Expense" : "Income"}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.section}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontFamily: FONTS.bold },
                  ]}
                >
                  ICON
                </Text>
                <View style={styles.iconGrid}>
                  {ICON_CHOICES.map((name) => {
                    const active = icon === name;
                    return (
                      <Pressable
                        key={name}
                        onPress={() => setIcon(name)}
                        style={[
                          styles.iconChoice,
                          {
                            backgroundColor: active
                              ? colors.primary
                              : colors.background,
                            borderColor: active
                              ? colors.primary
                              : colors.border,
                          },
                        ]}
                      >
                        <Ionicons
                          name={name}
                          size={18}
                          color={
                            active ? colors.onPrimary : colors.textSecondary
                          }
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={isBusy}
                style={[
                  styles.submitBtn,
                  {
                    backgroundColor: colors.primary,
                    opacity: isBusy ? 0.7 : 1,
                  },
                ]}
              >
                {isCreating || isUpdating ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text
                    style={[
                      styles.submitLabel,
                      { color: colors.onPrimary, fontFamily: FONTS.bold },
                    ]}
                  >
                    {isEditing ? "Save Changes" : "Create Category"}
                  </Text>
                )}
              </Pressable>

              {isEditing && (
                <Pressable
                  onPress={handleDelete}
                  disabled={isBusy}
                  style={styles.deleteLink}
                >
                  {isDeleting ? (
                    <ActivityIndicator color={colors.error} size="small" />
                  ) : (
                    <Text
                      style={[
                        styles.deleteLinkLabel,
                        { color: colors.error, fontFamily: FONTS.semiBold },
                      ]}
                    >
                      Delete category
                    </Text>
                  )}
                </Pressable>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </DraggableSheet>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "88%",
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
  body: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  section: { gap: SPACING.sm },
  label: { fontSize: 11, letterSpacing: 0.6 },
  textInput: {
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
  },
  typeRow: { flexDirection: "row", gap: SPACING.sm },
  typeBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  typeLabel: { fontSize: 14 },
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  iconChoice: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtn: {
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm,
  },
  submitLabel: { fontSize: 16 },
  deleteLink: { alignItems: "center", paddingVertical: SPACING.sm },
  deleteLinkLabel: { fontSize: 14 },
});
