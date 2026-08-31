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
  const { pickAndImport, isImporting, fileName, result, error } = usePickAndImportStatement();

  function handleContinue() {
    navigation.navigate("OnboardingGoal", {
      source: "statement",
      transactionCount: result?.imported ?? 0,
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

      {/* Result summary */}
      {result && (
        <View
          style={{
            backgroundColor: colors.surface2,
            borderRadius: RADIUS.md,
            padding: SPACING.md,
            marginBottom: SPACING.lg,
            gap: 6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons
              name={result.imported > 0 ? "checkmark-circle" : "information-circle"}
              size={18}
              color={result.imported > 0 ? colors.success : colors.textSecondary}
            />
            <Text
              style={{
                fontFamily: FONTS.semiBold,
                fontSize: FONT_SIZE.body,
                color: result.imported > 0 ? colors.success : colors.textPrimary,
              }}
            >
              {result.imported > 0
                ? `${result.imported} transaction${result.imported === 1 ? "" : "s"} imported`
                : "No transactions were imported from that file"}
            </Text>
          </View>
          {(result.skippedDuplicates > 0 || result.skippedInvalid > 0) && (
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: FONT_SIZE.bodySmall,
                color: colors.textSecondary,
              }}
            >
              {result.skippedDuplicates} duplicate{result.skippedDuplicates === 1 ? "" : "s"} skipped,{" "}
              {result.skippedInvalid} invalid row{result.skippedInvalid === 1 ? "" : "s"} skipped
            </Text>
          )}
        </View>
      )}

      {/* CTA */}
      {result ? (
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
