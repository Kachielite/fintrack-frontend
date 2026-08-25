import React, { useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { useCategories } from "../hooks/use-categories";
import { getCategoryIconName } from "@/features/transactions/transactions.constants";
import { ICategory } from "../categories.interface";
import CategoryFormSheet from "../components/category-form-sheet";
import SectionHeader from "@/core/common/components/SectionHeader";
import SkeletonBox from "@/core/common/components/SkeletonBox";

export default function CategoryManagementScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { data: categories = [], isLoading } = useCategories();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null,
  );

  const customCategories = categories.filter((c) => !c.isSystem);
  const systemCategories = categories.filter((c) => c.isSystem);

  function openCreate() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function openEdit(category: ICategory) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={[styles.headerBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontFamily: FONTS.bold },
          ]}
        >
          Categories
        </Text>
        <Pressable
          onPress={openCreate}
          hitSlop={12}
          accessibilityLabel="Add category"
          style={[styles.headerBtn, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={22} color={colors.onPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={{ gap: SPACING.sm }}>
            {[0, 1, 2, 3].map((i) => (
              <SkeletonBox
                key={i}
                width="100%"
                height={56}
                radius={RADIUS.md}
              />
            ))}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <SectionHeader title="Your categories" />
              {customCategories.length === 0 ? (
                <Text
                  style={[
                    styles.emptyText,
                    { color: colors.textSubtle, fontFamily: FONTS.regular },
                  ]}
                >
                  You haven't created any categories yet. Tap + to add one.
                </Text>
              ) : (
                <View
                  style={[
                    styles.list,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {customCategories.map((cat, i) => (
                    <React.Fragment key={cat.id}>
                      <Pressable
                        onPress={() => openEdit(cat)}
                        style={styles.row}
                      >
                        <View
                          style={[
                            styles.iconWrap,
                            { backgroundColor: colors.surface2 },
                          ]}
                        >
                          <Ionicons
                            name={
                              getCategoryIconName(cat.slug, categories) as any
                            }
                            size={17}
                            color={colors.textSecondary}
                          />
                        </View>
                        <Text
                          style={[
                            styles.rowLabel,
                            {
                              color: colors.textPrimary,
                              fontFamily: FONTS.medium,
                            },
                          ]}
                        >
                          {cat.name}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={colors.textSubtle}
                        />
                      </Pressable>
                      {i < customCategories.length - 1 && (
                        <View
                          style={[
                            styles.divider,
                            { backgroundColor: colors.border },
                          ]}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <SectionHeader title="Built-in categories" />
              <View
                style={[
                  styles.list,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                {systemCategories.map((cat, i) => (
                  <React.Fragment key={cat.id}>
                    <View style={styles.row}>
                      <View
                        style={[
                          styles.iconWrap,
                          { backgroundColor: colors.surface2 },
                        ]}
                      >
                        <Ionicons
                          name={
                            getCategoryIconName(cat.slug, categories) as any
                          }
                          size={17}
                          color={colors.textSubtle}
                        />
                      </View>
                      <Text
                        style={[
                          styles.rowLabel,
                          {
                            color: colors.textSecondary,
                            fontFamily: FONTS.regular,
                          },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </View>
                    {i < systemCategories.length - 1 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.border },
                        ]}
                      />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <CategoryFormSheet
        visible={formOpen}
        onClose={() => setFormOpen(false)}
        category={editingCategory}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    gap: SPACING.xs,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { flex: 1, fontSize: FONT_SIZE.h1, letterSpacing: -0.6 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  section: { gap: SPACING.sm },
  emptyText: { fontSize: 13, lineHeight: 20 },
  list: { borderRadius: RADIUS.lg, borderWidth: 1, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 14 },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: SPACING.md + 32 + SPACING.sm,
  },
});
