import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import OnboardingProgressBar from "../components/onboarding-progress-bar";
import GmailVisual from "../components/gmail-visual";
import GmailReassuranceCard from "../components/gmail-reassurance-card";
import GmailHowToSheet from "../components/gmail-how-to-sheet";

export default function OnboardingGmailScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <GmailHowToSheet visible={showHowTo} onClose={() => setShowHowTo(false)} />
      <View style={styles.progressRow}>
        <OnboardingProgressBar step={1} total={3} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GmailVisual />

        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.extraBold }]}>
          Let's give your bank emails a home in Gmail.
        </Text>

        <Text style={[styles.body, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
          Create a label called{" "}
          <Text style={{ color: colors.textPrimary, fontFamily: FONTS.semiBold }}>
            Bank Transactions
          </Text>{" "}
          in Gmail, then route your bank alerts there with a filter. We'll only ever read from that one label.
        </Text>

        <GmailReassuranceCard />
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={() => navigation.navigate("OnboardingConnect" as never)}
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.primaryBtnText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
            I've set up the label
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setShowHowTo(true)}
          style={styles.ghostBtn}
        >
          <Text style={[styles.ghostBtnText, { color: colors.textSecondary, fontFamily: FONTS.medium }]}>
            Show me how →
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  progressRow: { paddingTop: SPACING.xl },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.base,
  },
  title: {
    fontSize: FONT_SIZE.h1,
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 12,
  },
  body: {
    fontSize: FONT_SIZE.body,
    lineHeight: 24,
    marginBottom: 24,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: 12,
    paddingBottom: SPACING.xxl,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  primaryBtn: {
    height: 54,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 16 },
  ghostBtn: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostBtnText: { fontSize: 15 },
});
