import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  Linking,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";

// ─── Universal base filter ────────────────────────────────────────────────────

const BASE_FILTER =
  `subject:(debit OR credit OR debited OR credited OR "transaction alert" OR "account alert" OR "payment alert" OR "transfer alert" OR "transaction notification" OR "you have sent" OR "you have received" OR "payment received" OR "payment sent" OR "funds received" OR "funds transferred" OR withdrawal) ` +
  `-has:attachment -subject:(statement OR OTP OR "one-time" OR password OR promo OR newsletter OR offer)`;

// ─── Small reusable atoms ─────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  const colors = useThemeColors();
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIconBadge, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon as any} size={16} color={colors.primary} />
      </View>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
        {title}
      </Text>
    </View>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  const colors = useThemeColors();
  return (
    <View style={styles.stepRow}>
      <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.badgeText, { color: colors.primary, fontFamily: FONTS.bold }]}>
          {n}
        </Text>
      </View>
      <Text style={[styles.stepText, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
        {children}
      </Text>
    </View>
  );
}

function Bold({ children }: { children: string }) {
  const colors = useThemeColors();
  return (
    <Text style={{ color: colors.textPrimary, fontFamily: FONTS.semiBold }}>{children}</Text>
  );
}

function Divider() {
  const colors = useThemeColors();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

// ─── Warning banner ───────────────────────────────────────────────────────────

function WarningBanner({ children }: { children: React.ReactNode }) {
  const colors = useThemeColors();
  return (
    <View style={[styles.warningBanner, { backgroundColor: colors.warningLight, borderColor: colors.warningMid }]}>
      <Ionicons name="warning-outline" size={16} color={colors.warning} />
      <Text style={[styles.tipText, { color: colors.warning, fontFamily: FONTS.regular }]}>
        {children}
      </Text>
    </View>
  );
}

// ─── Exclusion table row ──────────────────────────────────────────────────────

function ExclusionRow({ rule, removes }: { rule: string; removes: string }) {
  const colors = useThemeColors();
  return (
    <View style={[styles.tableRow, { borderBottomColor: colors.border }]}>
      <Text
        style={[styles.tableCode, { color: colors.primary, fontFamily: FONTS.semiBold, backgroundColor: colors.primaryLight }]}
      >
        {rule}
      </Text>
      <Text style={[styles.tableDesc, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
        {removes}
      </Text>
    </View>
  );
}

// ─── Main sheet ───────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function GmailHowToSheet({ visible, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [bankEmail, setBankEmail] = useState("");

  const senderClause = bankEmail.trim() ? ` OR from:${bankEmail.trim()}` : "";
  const finalFilter = BASE_FILTER + senderClause;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* flex: 1 container — backdrop takes top space, sheet sits at bottom */}
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + SPACING.lg,
            },
          ]}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

          {/* Fixed header */}
          <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sheetTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              How to set up your label
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Scrollable body */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Browser tip */}
            <View style={[styles.tipBanner, { backgroundColor: colors.primaryLight, borderColor: colors.primaryMid }]}>
              <Ionicons name="information-circle" size={16} color={colors.primary} />
              <Text style={[styles.tipText, { color: colors.primary, fontFamily: FONTS.regular }]}>
                Gmail filters can only be created on{" "}
                <Text style={{ fontFamily: FONTS.semiBold }}>gmail.com</Text> in a browser, not the mobile app.
              </Text>
            </View>

            {/* ── Part 1: Create the label ─────────────────────────────── */}
            <SectionHeader icon="folder-open-outline" title="Step 1 — Create the label" />
            <Step n={1}>Open <Bold>gmail.com</Bold> in your browser and sign in.</Step>
            <Step n={2}>
              Click the <Bold>☰ Menu</Bold> on the left sidebar, scroll down and click{" "}
              <Bold>Create new label</Bold>.
            </Step>
            <Step n={3}>
              Name it exactly: <Bold>Bank Transactions</Bold> — spelling and capitalisation matter.
            </Step>
            <Step n={4}>Click <Bold>Create</Bold>. The label will appear in your sidebar.</Step>

            <Divider />

            {/* ── Part 2: Set up the filter ────────────────────────────── */}
            <SectionHeader icon="options-outline" title="Step 2 — Route your bank emails" />

            <WarningBanner>
              Paste the filter into the{" "}
              <Text style={{ fontFamily: FONTS.semiBold }}>search bar</Text> at the top of Gmail — not into the Subject field. The Subject field does not support filter operators and will match nothing.
            </WarningBanner>

            <Step n={1}>
              Click the <Bold>search bar</Bold> at the very top of Gmail — the long bar that spans the full width of the page.
            </Step>
            <Step n={2}>
              Copy the filter string from below and paste it <Bold>directly into the search bar</Bold>.
            </Step>
            <Step n={3}>
              Press <Bold>Enter</Bold> to run the search. Your bank transaction emails should appear in the results. If none appear, your inbox may not have any yet — that is fine, the filter will work going forward.
            </Step>
            <Step n={4}>
              Click the <Bold>show search options</Bold> icon — the small slider icon at the right end of the search bar. This opens the filter form with your query already loaded.
            </Step>
            <Step n={5}>
              Click <Bold>Create filter</Bold> at the bottom right of the form that appears.
            </Step>
            <Step n={6}>
              On the next screen, tick <Bold>Apply the label</Bold> and select <Bold>Bank Transactions</Bold> from the dropdown.
            </Step>
            <Step n={7}>
              Optional but recommended: also tick <Bold>Also apply filter to matching conversations</Bold> to sort existing bank emails into the label automatically.
            </Step>
            <Step n={8}>Click <Bold>Create filter</Bold>. You are done.</Step>

            <Divider />

            {/* ── Universal filter query ───────────────────────────────── */}
            <SectionHeader icon="sparkles-outline" title="Ready-made filter" />

            <Text style={[styles.queryCaption, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
              Works with banks worldwide — GTBank, Barclays, Chase, Wise, Revolut, FNB, Equity Bank, and more.
              No configuration needed.
            </Text>

            {/* Optional sender input */}
            <View style={[styles.senderRow, { borderColor: colors.border, backgroundColor: colors.surface2 }]}>
              <Ionicons name="mail-outline" size={16} color={colors.textSubtle} />
              <TextInput
                value={bankEmail}
                onChangeText={setBankEmail}
                placeholder="Your bank's alert email (optional)"
                placeholderTextColor={colors.textSubtle}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={[
                  styles.senderInput,
                  { color: colors.textPrimary, fontFamily: FONTS.regular },
                ]}
              />
              {bankEmail.length > 0 && (
                <Pressable onPress={() => setBankEmail("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={16} color={colors.textSubtle} />
                </Pressable>
              )}
            </View>
            {bankEmail.trim().length > 0 && (
              <Text style={[styles.senderHint, { color: colors.primary, fontFamily: FONTS.regular }]}>
                Your bank's sender address has been appended to the filter below.
              </Text>
            )}

            {/* The final copyable filter */}
            <View style={[styles.queryBox, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
              <Text
                selectable
                style={[styles.queryText, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}
              >
                {finalFilter}
              </Text>
            </View>
            <Text style={[styles.selectHint, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
              Tap and hold to select all, then copy — or copy from the search bar on your computer.
            </Text>

            <Divider />

            {/* ── Why no bank list ─────────────────────────────────────── */}
            <SectionHeader icon="globe-outline" title="Why this works everywhere" />
            <Text style={[styles.bodyText, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
              Every bank in the world follows the same pattern: they tell you money moved, how much, and your new balance.
              The filter matches on those universal signal words in the subject line, not on knowing your specific bank's
              email address.
            </Text>
            <Text style={[styles.bodyText, { color: colors.textSecondary, fontFamily: FONTS.regular, marginTop: 8 }]}>
              The exclusions below are what keep it precise — they filter out statements, OTPs, and promotional emails
              that mention money but aren't transactions.
            </Text>

            {/* Exclusion table */}
            <View style={[styles.table, { borderColor: colors.border }]}>
              {[
                { rule: "-has:attachment", removes: "Monthly PDF statements" },
                { rule: "-subject:OTP", removes: "One-time password emails" },
                { rule: '-subject:"one-time"', removes: "Same, different phrasing" },
                { rule: "-subject:password", removes: "Password reset alerts" },
                { rule: "-subject:statement", removes: "Account statements" },
                { rule: "-subject:newsletter", removes: "Bank marketing" },
                { rule: "-subject:promo", removes: "Promotional campaigns" },
                { rule: "-subject:offer", removes: "Same, different wording" },
              ].map((row) => (
                <ExclusionRow key={row.rule} rule={row.rule} removes={row.removes} />
              ))}
            </View>

            <Divider />

            {/* Learn more */}
            <Pressable
              onPress={() => Linking.openURL("https://support.google.com/mail/answer/6579")}
              style={styles.learnMoreRow}
            >
              <Ionicons name="logo-google" size={16} color={colors.textSecondary} />
              <Text style={[styles.learnMoreText, { color: colors.textSecondary, fontFamily: FONTS.medium }]}>
                Learn more about Gmail filters on Google
              </Text>
              <Ionicons name="arrow-forward" size={14} color={colors.textSubtle} />
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    height: SCREEN_HEIGHT * 0.9,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 99,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheetTitle: { fontSize: FONT_SIZE.h3 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  tipBanner: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  warningBanner: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  tipText: { flex: 1, fontSize: 13, lineHeight: 19 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  sectionIconBadge: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { fontSize: 15 },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: SPACING.md,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  badgeText: { fontSize: 12 },
  stepText: { flex: 1, fontSize: 14, lineHeight: 21 },
  divider: { height: 1, marginVertical: SPACING.lg },
  queryCaption: { fontSize: 13, lineHeight: 19, marginBottom: SPACING.md },
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === "android" ? SPACING.sm : SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.xs,
  },
  senderInput: { flex: 1, fontSize: 14, padding: 0 },
  senderHint: { fontSize: 12, marginBottom: SPACING.sm },
  queryBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.sm,
  },
  queryText: { fontSize: 13, lineHeight: 20 },
  selectHint: { fontSize: 12, marginTop: 6, marginBottom: 4 },
  bodyText: { fontSize: 14, lineHeight: 21 },
  table: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tableCode: {
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 120,
  },
  tableDesc: { flex: 1, fontSize: 13 },
  learnMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: SPACING.sm,
  },
  learnMoreText: { flex: 1, fontSize: 14 },
});
