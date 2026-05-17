import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING } from "@/core/common/constants/theme";

const LAST_UPDATED = "May 2025";

const SECTIONS = [
  {
    title: "1. Information we collect",
    body: `Vela collects the minimum information needed to deliver its service:\n\n• Email address and name — used for authentication and to personalise your experience.\n• Gmail email content — read-only access to emails in your selected label. We extract transaction data (amount, merchant, currency, date) and store it. We never store the full email body.\n• Transaction data — amounts, merchants, categories, and dates derived from your bank emails.\n• Usage data — in-app actions and feature usage to improve the product. This data is anonymised and aggregated.`,
  },
  {
    title: "2. How we use your information",
    body: `We use your information to:\n\n• Parse bank notification emails and extract transaction data.\n• Generate AI-powered spending insights via Iris, our financial advisor.\n• Calculate summaries, budgets, and goal progress.\n• Send you notifications about your finances (if enabled).\n• Improve our models and features through anonymised, aggregated usage analytics.\n\nWe do not sell your data to third parties. Ever.`,
  },
  {
    title: "3. AI and data processing",
    body: `Vela uses OpenAI's API to generate financial insights. Transaction summaries — not your raw emails — are sent to OpenAI for processing. These summaries contain aggregated spending data without personally identifiable payment details.\n\nOpenAI processes this data under their API data usage policies. Data sent via the API is not used to train OpenAI's models.`,
  },
  {
    title: "4. Gmail access",
    body: `We request read-only access to Gmail labels you explicitly select. We do not read, store, or process emails outside the label you configure.\n\nYou can revoke Gmail access at any time via Google Account settings or by disconnecting your account in Vela → Profile → Email connections. Revoking access stops new transactions from being imported but does not delete data already processed.`,
  },
  {
    title: "5. Data retention",
    body: `Your transaction data is retained for as long as your account is active. When you delete your account:\n\n• Your account and profile data are deleted within 30 days.\n• Your raw transaction data is deleted within 30 days.\n• Anonymised, aggregated analytics data (not linked to you) may be retained.\n\nYou can request immediate deletion by contacting us at privacy@vela.app.`,
  },
  {
    title: "6. Security",
    body: `We use industry-standard security measures:\n\n• All data is encrypted in transit (TLS 1.3) and at rest.\n• API access tokens are stored securely and never exposed client-side.\n• We do not store Google OAuth refresh tokens beyond what is needed for session management.\n• We perform regular security reviews of our infrastructure.`,
  },
  {
    title: "7. Your rights",
    body: `Depending on your location, you may have the right to:\n\n• Access the personal data we hold about you.\n• Request correction of inaccurate data.\n• Request deletion of your data.\n• Export your data in a portable format.\n• Withdraw consent for processing at any time.\n\nTo exercise any of these rights, contact us at privacy@vela.app.`,
  },
  {
    title: "8. Changes to this policy",
    body: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you in-app and update the "Last updated" date below. Continued use of Vela after changes take effect constitutes acceptance of the revised policy.`,
  },
  {
    title: "9. Contact",
    body: `If you have questions or concerns about this Privacy Policy or how we handle your data, contact us:\n\nEmail: privacy@vela.app\n\nWe aim to respond to all requests within 5 business days.`,
  },
];

export default function PrivacyPolicyScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: SPACING.xxxl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lastUpdated, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
          Last updated: {LAST_UPDATED}
        </Text>
        <Text style={[styles.intro, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
          Vela is built on the premise that your financial data belongs to you. This policy explains what we collect, how we use it, and how we protect it.
        </Text>

        <View style={{ gap: SPACING.xl }}>
          {SECTIONS.map((s) => (
            <View key={s.title}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                {s.title}
              </Text>
              <Text style={[styles.sectionBody, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
                {s.body}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.md },
  lastUpdated: { fontSize: 12, marginBottom: SPACING.sm },
  intro: { fontSize: 14, lineHeight: 22, marginBottom: SPACING.xl },
  sectionTitle: { fontSize: FONT_SIZE.body, letterSpacing: -0.2, marginBottom: SPACING.sm },
  sectionBody: { fontSize: 14, lineHeight: 22 },
});
