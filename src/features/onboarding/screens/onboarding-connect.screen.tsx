import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import OnboardingProgressBar from "../components/onboarding-progress-bar";
import GmailConnectVisual from "../components/gmail-connect-visual";
import { EmailConnectionService } from "@/features/email-connection/email-connection.service";

// Must match APP_DEEP_LINK in app.ts and the "scheme" in app.json
const DEEP_LINK_BASE = "fintrack://oauth/gmail";
const LABEL_NAME = "Bank Transactions";

type Phase = "idle" | "loading" | "label_missing" | "retrying" | "error";

export default function OnboardingConnectScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const [phase, setPhase] = useState<Phase>("idle");
  // Stored after backend creates the connection so Retry skips the OAuth flow
  const [connectionId, setConnectionId] = useState<number | null>(null);

  const detectAndSetLabel = async (connId: number): Promise<boolean> => {
    const labels = await EmailConnectionService.listLabels(connId);
    const bankLabel = labels.find(
      (l) => l.name.toLowerCase() === LABEL_NAME.toLowerCase(),
    );
    if (!bankLabel) return false;
    await EmailConnectionService.setLabel(connId, {
      label_id: bankLabel.id,
      label_name: bankLabel.name,
    });
    return true;
  };

  const connect = async () => {
    setPhase("loading");

    try {
      // Backend generates the auth URL with its own redirect URI (server-side callback)
      const authUrl = await EmailConnectionService.getAuthUrl();

      // Open Google OAuth. Backend callback will redirect to fintrack://oauth/gmail?connection_id=X
      const result = await WebBrowser.openAuthSessionAsync(authUrl, DEEP_LINK_BASE);

      if (result.type !== "success") {
        setPhase("idle");
        return;
      }

      const parsedUrl = new URL(result.url);
      const error = parsedUrl.searchParams.get("error");
      if (error) throw new Error(error);

      const connId = Number(parsedUrl.searchParams.get("connection_id"));
      if (!connId) throw new Error("No connection_id in redirect");

      setConnectionId(connId);

      const found = await detectAndSetLabel(connId);
      if (!found) {
        setPhase("label_missing");
        return;
      }

      navigation.navigate("OnboardingGoal" as never);
    } catch {
      setPhase("error");
    }
  };

  const retry = async () => {
    if (!connectionId) {
      setPhase("idle");
      return;
    }
    setPhase("retrying");
    try {
      const found = await detectAndSetLabel(connectionId);
      if (!found) {
        setPhase("label_missing");
        return;
      }
      navigation.navigate("OnboardingGoal" as never);
    } catch {
      setPhase("error");
    }
  };

  const isBusy = phase === "loading" || phase === "retrying";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.progressRow}>
        <OnboardingProgressBar step={2} total={3} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GmailConnectVisual />

        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.extraBold }]}>
          Connect your Gmail
        </Text>

        <Text style={[styles.body, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
          Tap below and sign in with Google. We'll only ask for{" "}
          <Text style={{ color: colors.textPrimary, fontFamily: FONTS.semiBold }}>
            read-only access
          </Text>{" "}
          to your Gmail — just enough to find emails inside your{" "}
          <Text style={{ color: colors.textPrimary, fontFamily: FONTS.semiBold }}>
            Bank Transactions
          </Text>{" "}
          label.
        </Text>

        <View style={[styles.privacyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.privacyTitle, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
            What we access
          </Text>
          {[
            { emoji: "✅", text: "Emails inside Bank Transactions label only" },
            { emoji: "✅", text: "Read-only — we never send or delete emails" },
            { emoji: "❌", text: "No access to any other labels or inbox" },
          ].map((item) => (
            <View key={item.text} style={styles.privacyRow}>
              <Text style={styles.privacyEmoji}>{item.emoji}</Text>
              <Text style={[styles.privacyText, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        {phase === "label_missing" && (
          <View style={[styles.alertCard, { backgroundColor: colors.warningLight, borderColor: colors.warningMid }]}>
            <Text style={[styles.alertTitle, { color: colors.warning, fontFamily: FONTS.semiBold }]}>
              Label not found
            </Text>
            <Text style={[styles.alertBody, { color: colors.warning, fontFamily: FONTS.regular }]}>
              We couldn't find a label named{" "}
              <Text style={{ fontFamily: FONTS.bold }}>"Bank Transactions"</Text> in your Gmail.
              {"\n\n"}
              Go back, create it in Gmail, then tap{" "}
              <Text style={{ fontFamily: FONTS.semiBold }}>Retry</Text>.
            </Text>
          </View>
        )}

        {phase === "error" && (
          <View style={[styles.alertCard, { backgroundColor: colors.warningLight, borderColor: colors.warningMid }]}>
            <Text style={[styles.alertTitle, { color: colors.error, fontFamily: FONTS.semiBold }]}>
              Connection failed
            </Text>
            <Text style={[styles.alertBody, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
              Something went wrong connecting to Gmail. Please try again.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {phase === "label_missing" ? (
          <>
            <Pressable
              onPress={retry}
              disabled={isBusy}
              style={[styles.primaryBtn, { backgroundColor: colors.primary, opacity: isBusy ? 0.7 : 1 }]}
            >
              {isBusy ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={[styles.primaryBtnText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
                  Retry
                </Text>
              )}
            </Pressable>
            <Pressable onPress={() => navigation.goBack()} style={styles.ghostBtn}>
              <Text style={[styles.ghostBtnText, { color: colors.textSecondary, fontFamily: FONTS.medium }]}>
                ← Back to label setup
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={connect}
            disabled={isBusy}
            style={[styles.primaryBtn, { backgroundColor: colors.primary, opacity: isBusy ? 0.7 : 1 }]}
          >
            {isBusy ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={[styles.primaryBtnText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
                {phase === "error" ? "Try again" : "Connect with Google"}
              </Text>
            )}
          </Pressable>
        )}
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
    alignItems: "flex-start",
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
  privacyCard: {
    width: "100%",
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: SPACING.base,
    gap: 10,
  },
  privacyTitle: { fontSize: 13, marginBottom: 2 },
  privacyRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  privacyEmoji: { fontSize: 14, lineHeight: 20 },
  privacyText: { fontSize: 13, lineHeight: 20, flex: 1 },
  alertCard: {
    width: "100%",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.base,
    marginTop: SPACING.lg,
    gap: 6,
  },
  alertTitle: { fontSize: 14 },
  alertBody: { fontSize: 13, lineHeight: 20 },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: 12,
    paddingBottom: SPACING.xxl,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
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
