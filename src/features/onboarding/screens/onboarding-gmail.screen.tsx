import React from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import ScreenContainer from "@/core/common/components/ScreenContainer";
import PrimaryButton from "@/core/common/components/PrimaryButton";
import { useConnectGmail } from "@/features/email-connection/hooks/use-connect-gmail";

const SETUP_ITEMS = [
  {
    icon: "folder-outline" as const,
    title: "A private folder, just for bank emails",
    desc: "We create a Bank Transactions folder in your Gmail. Your bank alerts go there automatically.",
  },
  {
    icon: "filter-outline" as const,
    title: "New alerts land there instantly",
    desc: "Every transaction email gets filed the moment it arrives, so nothing gets missed.",
  },
  {
    icon: "time-outline" as const,
    title: "Your history is ready from day one",
    desc: "We pull in your existing bank emails so your spending history is complete right away.",
  },
  {
    icon: "lock-closed-outline" as const,
    title: "That folder is all we ever see",
    desc: "We can't read your other emails, search your inbox, or access anything outside that one folder.",
  },
];

export default function OnboardingGmailScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { connectGmail, isConnecting, isSuccess, alreadyConnected, error } = useConnectGmail();

  const handleConnect = () => {
    connectGmail({
      onSuccess: () => {
        setTimeout(() => navigation.navigate("OnboardingGoal"), 1200);
      },
    });
  };

  return (
    <ScreenContainer scrollable>
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
        <Ionicons name="mail-outline" size={32} color={colors.primary} />
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
        Your bank emails, organised automatically
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
        Connect once and we handle everything automatically. Your bank emails keep arriving in your inbox exactly as normal. We just quietly organise them in the background.
      </Text>

      {/* What we set up */}
      <View style={{ gap: SPACING.md, marginBottom: SPACING.xxxl }}>
        {SETUP_ITEMS.map((item) => (
          <View
            key={item.icon}
            style={{ flexDirection: "row", gap: SPACING.md, alignItems: "flex-start" }}
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

      {/* Error state */}
      {error && (
        <View
          style={{
            backgroundColor: colors.surface2,
            borderRadius: RADIUS.md,
            padding: SPACING.md,
            marginBottom: SPACING.lg,
            flexDirection: "row",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <Ionicons name="warning-outline" size={16} color={colors.error} />
          <Text
            style={{
              flex: 1,
              fontFamily: FONTS.regular,
              fontSize: FONT_SIZE.bodySmall,
              color: colors.error,
              lineHeight: 20,
            }}
          >
            Something went wrong connecting your Gmail. Please try again.
          </Text>
        </View>
      )}

      {/* CTA */}
      {isSuccess ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            paddingVertical: SPACING.lg,
            backgroundColor: colors.surface2,
            borderRadius: RADIUS.md,
          }}
        >
          <Ionicons name="checkmark-circle" size={22} color={colors.success} />
          <Text
            style={{
              fontFamily: FONTS.semiBold,
              color: colors.success,
              fontSize: FONT_SIZE.body,
            }}
          >
            {alreadyConnected ? "Already connected — tokens refreshed" : "Gmail connected successfully"}
          </Text>
        </View>
      ) : (
        <PrimaryButton
          label={isConnecting ? "Connecting…" : "Connect Gmail"}
          onPress={handleConnect}
          isLoading={isConnecting}
          disabled={isConnecting}
        />
      )}

      {/* Privacy note */}
      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: FONT_SIZE.caption,
          color: colors.textSubtle,
          textAlign: "center",
          marginTop: SPACING.lg,
        }}
      >
        Gmail access is limited to the Bank Transactions folder only. You can disconnect at any time in Settings.
      </Text>
    </ScreenContainer>
  );
}
