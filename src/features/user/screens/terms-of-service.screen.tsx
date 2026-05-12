import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING } from "@/core/common/constants/theme";

const LAST_UPDATED = "May 2025";

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: `By creating an account or using FinTrack ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.\n\nThese terms apply to all users of FinTrack, including users of our mobile application.`,
  },
  {
    title: "2. Description of service",
    body: `FinTrack is a personal finance tracking application that:\n\n• Reads bank notification emails from your Gmail account (with your permission) to extract transaction data.\n• Provides AI-powered financial insights, budgeting tools, and spending summaries.\n• Helps you track spending across multiple currencies.\n\nFinTrack is a personal finance tool only. It is not a bank, financial advisor, or investment advisor. Insights provided by Iris are informational and do not constitute professional financial advice.`,
  },
  {
    title: "3. Account registration",
    body: `You must create an account to use FinTrack. You agree to:\n\n• Provide accurate and complete information during registration.\n• Keep your account credentials secure and not share them with others.\n• Notify us immediately of any unauthorised access to your account.\n• Be responsible for all activity that occurs under your account.\n\nYou must be at least 18 years old to create an account.`,
  },
  {
    title: "4. Gmail access and permissions",
    body: `FinTrack requests read-only access to Gmail labels you explicitly select. By granting this access, you authorise FinTrack to:\n\n• Read emails within the selected label.\n• Extract transaction data from those emails.\n• Store the extracted transaction data on our servers.\n\nYou retain full ownership of your Gmail data. FinTrack does not modify, delete, or share your emails. You can revoke access at any time.`,
  },
  {
    title: "5. Acceptable use",
    body: `You agree not to:\n\n• Use the Service for any unlawful purpose or in violation of any applicable laws.\n• Attempt to reverse-engineer, decompile, or extract source code from the application.\n• Use the Service to process financial data belonging to others without their consent.\n• Attempt to circumvent security measures or access other users' accounts.\n• Use automated means to access the Service in ways that exceed normal usage.\n\nViolation of these rules may result in immediate account termination.`,
  },
  {
    title: "6. Intellectual property",
    body: `FinTrack and its original content, features, and functionality are owned by FinTrack and are protected by international copyright, trademark, and other intellectual property laws.\n\nYou retain ownership of your personal financial data. By using the Service, you grant FinTrack a limited, non-exclusive licence to process your data solely for the purpose of providing the Service.`,
  },
  {
    title: "7. Disclaimers",
    body: `The Service is provided "as is" and "as available" without warranties of any kind, express or implied.\n\nFinTrack does not warrant that:\n\n• The Service will be uninterrupted or error-free.\n• Transaction extraction will be 100% accurate — email formats vary and some transactions may be missed or miscategorised.\n• AI insights will be accurate or appropriate for your specific financial situation.\n\nAlways verify important financial decisions with qualified professionals.`,
  },
  {
    title: "8. Limitation of liability",
    body: `To the maximum extent permitted by law, FinTrack shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:\n\n• Loss of profits or revenue.\n• Financial decisions made based on FinTrack insights.\n• Data loss or corruption.\n• Unauthorised access to your account.\n\nOur total liability for any claim arising from your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim.`,
  },
  {
    title: "9. Account termination",
    body: `You may delete your account at any time via Profile → Delete account. Your data will be permanently deleted within 30 days of your request.\n\nWe reserve the right to suspend or terminate accounts that violate these Terms of Service, with or without notice.\n\nUpon termination, your right to use the Service ceases immediately.`,
  },
  {
    title: "10. Changes to terms",
    body: `We may update these Terms of Service from time to time. When we make material changes, we will notify you in-app at least 14 days before the changes take effect. Continued use of the Service after changes take effect constitutes acceptance of the revised terms.`,
  },
  {
    title: "11. Governing law",
    body: `These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these Terms or your use of the Service shall be resolved through good-faith negotiation first, followed by binding arbitration if necessary.`,
  },
  {
    title: "12. Contact",
    body: `For questions about these Terms of Service, contact us:\n\nEmail: legal@fintrack.app\n\nWe aim to respond to all inquiries within 5 business days.`,
  },
];

export default function TermsOfServiceScreen() {
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
          Please read these Terms of Service carefully before using FinTrack. These terms govern your use of our application and services.
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
