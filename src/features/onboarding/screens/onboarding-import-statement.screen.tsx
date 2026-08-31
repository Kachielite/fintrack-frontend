import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import ScreenContainer from "@/core/common/components/ScreenContainer";
import PrimaryButton from "@/core/common/components/PrimaryButton";
import { usePickAndImportStatement } from "@/features/transactions/hooks/use-pick-and-import-statement";

const SETUP_ITEMS = [
  {
    icon: "document-attach-outline" as const,
    title: "Export a statement from your bank's app",
    desc: "Most banking apps let you download a statement or transaction history as a CSV, Excel, PDF, or Word file.",
  },
  {
    icon: "options-outline" as const,
    title: "We figure out the columns for you",
    desc: "We automatically detect which columns are the date, description, and amount.",
  },
  {
    icon: "copy-outline" as const,
    title: "Duplicates are skipped automatically",
    desc: "If a transaction is already in your history, we won't add it twice.",
  },
  {
    icon: "flash-outline" as const,
    title: "Your history is ready right away",
    desc: "No waiting for emails to sync. Everything is organised the moment you import.",
  },
];

export default function OnboardingImportStatementScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { pickAndImport, isImporting, fileName, accepted, error } = usePickAndImportStatement();

  function handleContinue() {
    // The import runs in the background now — there's no known transaction
    // count yet at this point, just confirmation the upload was accepted.
    // OnboardingResultsScreen renders a distinct "in progress" state for this.
    navigation.navigate("OnboardingGoal", {
      source: "statement",
      pending: true,
    });
  }

  return (
    <ScreenContainer scrollable>
      {/* Back button */}
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={12}
        style={{
          width: 36,
          height: 36,
          borderRadius: RADIUS.md,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: SPACING.lg,
        }}
      >
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </Pressable>

      {/* Step indicator */}
      <View style={{ flexDirection: "row", gap: 6, marginBottom: SPACING.xxxl }}>
        {[1, 2].map((n) => (
          <View
            key={n}
            style={{
              height: 4,
              flex: 1,
              borderRadius: RADIUS.full,
              backgroundColor: n === 1 ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>

      {/* Icon */}
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: RADIUS.lg,
          backgroundColor: colors.primaryLight,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: SPACING.xl,
        }}
      >
        <Ionicons name="document-attach-outline" size={32} color={colors.primary} />
      </View>

      {/* Heading */}
      <Text
        style={{
          fontFamily: FONTS.bold,
          fontSize: FONT_SIZE.h1,
          color: colors.textPrimary,
          marginBottom: SPACING.md,
        }}
      >
        Your bank statement, organised in seconds
      </Text>

      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: FONT_SIZE.body,
          color: colors.textSecondary,
          lineHeight: 24,
          marginBottom: SPACING.xxxl,
        }}
      >
        Pick a statement export — CSV, Excel, PDF, or Word — and we will turn
        it into clear, categorised transactions in seconds.
      </Text>

      {/* What happens */}
      <View style={{ gap: SPACING.md, marginBottom: SPACING.xxxl }}>
        {SETUP_ITEMS.map((item) => (
          <View
            key={item.icon}
            style={{
              flexDirection: "row",
              gap: SPACING.md,
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: RADIUS.sm,
                backgroundColor: colors.primaryLight,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Ionicons name={item.icon} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: FONTS.semiBold,
                  fontSize: FONT_SIZE.body,
                  color: colors.textPrimary,
                  marginBottom: 2,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.regular,
                  fontSize: FONT_SIZE.bodySmall,
                  color: colors.textSecondary,
                  lineHeight: 20,
                }}
              >
                {item.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Error state — a file couldn't be read/parsed at all */}
      {error && !isImporting && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: SPACING.sm,
            backgroundColor: colors.error + "15",
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: colors.error + "55",
            padding: SPACING.md,
            marginBottom: SPACING.lg,
          }}
        >
          <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
          <Text
            style={{
              flex: 1,
              fontFamily: FONTS.medium,
              fontSize: FONT_SIZE.bodySmall,
              color: colors.error,
              lineHeight: 19,
            }}
          >
            {error}
          </Text>
        </View>
      )}

      {/* Upload accepted — processing continues in the background */}
      {accepted && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: colors.surface2,
            borderRadius: RADIUS.md,
            padding: SPACING.md,
            marginBottom: SPACING.lg,
          }}
        >
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text
            style={{
              flex: 1,
              fontFamily: FONTS.semiBold,
              fontSize: FONT_SIZE.body,
              color: colors.success,
            }}
          >
            Statement received — we're organising it now
          </Text>
        </View>
      )}

      {/* CTA */}
      {accepted ? (
        <PrimaryButton label="Continue" onPress={handleContinue} />
      ) : (
        <PrimaryButton
          label={isImporting ? "Importing…" : fileName ? "Try another file" : "Choose a statement file"}
          onPress={pickAndImport}
          isLoading={isImporting}
          disabled={isImporting}
        />
      )}
    </ScreenContainer>
  );
}
