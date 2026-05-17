import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Alert,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { useThemeStore } from "@/core/common/state/theme.state";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { RootStackParamList } from "@/core/navigation/root-navigator";
import { useProfile } from "@/features/user/hooks/use-profile";
import { useDeleteAccount } from "@/features/user/hooks/use-delete-account";
import { useAuthStore } from "@/features/auth/auth.state";
import { UserService } from "@/features/user/user.service";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import GlassCard from "@/core/common/components/GlassCard";
import SectionHeader from "@/core/common/components/SectionHeader";
import EmailConnectionsSheet from "@/features/email-connection/components/email-connections-sheet";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const CURRENCIES: { code: string; name: string; symbol: string }[] = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
];

const PLANS = [
  {
    key: "free",
    label: "Free",
    price: null,
    description: "Get started with essential tracking",
    features: [
      "Up to 2 email connections",
      "100 transactions / month",
      "Basic AI insights",
      "Single reference currency",
      "Community support",
    ],
  },
  {
    key: "pro",
    label: "Pro",
    price: "$9.99 / mo",
    description: "For the serious money manager",
    features: [
      "Unlimited email connections",
      "Unlimited transactions",
      "Advanced AI insights with charts",
      "Multi-currency tracking",
      "Budget recommendations",
      "Priority support",
    ],
  },
  {
    key: "business",
    label: "Business",
    price: "$24.99 / mo",
    description: "For teams and business expenses",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Business expense reports",
      "Custom categories",
      "API access",
      "Dedicated support",
    ],
  },
];

// ─── Row component ─────────────────────────────────────────────────────────────

function SettingRow({
  icon,
  label,
  sub,
  value,
  onPress,
  destructive = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  sub?: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.settingRow, pressed && { opacity: 0.65 }]}
    >
      <View style={[styles.settingIcon, { backgroundColor: destructive ? colors.error + "18" : colors.primaryLight }]}>
        <Ionicons name={icon} size={17} color={destructive ? colors.error : colors.primary} />
      </View>
      <View style={styles.settingMid}>
        <Text style={[styles.settingLabel, { color: destructive ? colors.error : colors.textPrimary, fontFamily: FONTS.semiBold }]}>
          {label}
        </Text>
        {sub ? (
          <Text style={[styles.settingSub, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
            {sub}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text style={[styles.settingValue, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
          {value}
        </Text>
      ) : null}
      {onPress && !destructive ? (
        <Ionicons name="chevron-forward" size={15} color={colors.textSubtle} />
      ) : null}
    </Pressable>
  );
}

// ─── Currency picker sheet ──────────────────────────────────────────────────────

function CurrencySheet({
  visible,
  current,
  onSelect,
  onClose,
}: {
  visible: boolean;
  current: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={sheetStyles.overlay}>
        <Pressable style={sheetStyles.backdrop} onPress={onClose} />
        <View style={[sheetStyles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg }]}>
          <View style={[sheetStyles.handle, { backgroundColor: colors.borderStrong }]} />
          <View style={sheetStyles.header}>
            <Text style={[sheetStyles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              Reference currency
            </Text>
            <Pressable onPress={onClose} hitSlop={12} style={[sheetStyles.closeBtn, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
          <Text style={[sheetStyles.subtitle, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
            All totals and conversions across the app will use this currency.
          </Text>
          <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: SPACING.sm, paddingBottom: SPACING.lg }} showsVerticalScrollIndicator={false}>
            {CURRENCIES.map((c) => {
              const active = c.code === current;
              return (
                <Pressable
                  key={c.code}
                  onPress={() => onSelect(c.code)}
                  style={[
                    sheetStyles.currencyRow,
                    {
                      backgroundColor: active ? colors.primaryLight : colors.surface2,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <View style={[sheetStyles.symbolBadge, { backgroundColor: colors.surface }]}>
                    <Text style={[sheetStyles.symbol, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                      {c.symbol}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[sheetStyles.currencyCode, { color: active ? colors.primary : colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                      {c.code}
                    </Text>
                    <Text style={[sheetStyles.currencyName, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                      {c.name}
                    </Text>
                  </View>
                  {active && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Plans sheet ───────────────────────────────────────────────────────────────

function PlansSheet({ visible, currentTier, onClose }: { visible: boolean; currentTier: string; onClose: () => void }) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={sheetStyles.overlay}>
        <Pressable style={sheetStyles.backdrop} onPress={onClose} />
        <View style={[sheetStyles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg, maxHeight: SCREEN_HEIGHT * 0.92 }]}>
          <View style={[sheetStyles.handle, { backgroundColor: colors.borderStrong }]} />
          <View style={sheetStyles.header}>
            <Text style={[sheetStyles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              Plans
            </Text>
            <Pressable onPress={onClose} hitSlop={12} style={[sheetStyles.closeBtn, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: SPACING.md, paddingBottom: SPACING.lg }} showsVerticalScrollIndicator={false}>
            {PLANS.map((plan) => {
              const isCurrent = plan.key === currentTier;
              const isHighlighted = plan.key === "pro";
              return (
                <View
                  key={plan.key}
                  style={[
                    planStyles.card,
                    {
                      backgroundColor: isHighlighted ? colors.primaryLight : colors.surface2,
                      borderColor: isHighlighted ? colors.primary : colors.border,
                      borderWidth: isHighlighted ? 1.5 : 1,
                    },
                  ]}
                >
                  <View style={planStyles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <View style={planStyles.labelRow}>
                        <Text style={[planStyles.planLabel, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                          {plan.label}
                        </Text>
                        {isCurrent && (
                          <View style={[planStyles.currentBadge, { backgroundColor: colors.primary }]}>
                            <Text style={[planStyles.currentText, { color: colors.onPrimary, fontFamily: FONTS.bold }]}>
                              Current
                            </Text>
                          </View>
                        )}
                        {isHighlighted && !isCurrent && (
                          <View style={[planStyles.currentBadge, { backgroundColor: colors.primary }]}>
                            <Text style={[planStyles.currentText, { color: colors.onPrimary, fontFamily: FONTS.bold }]}>
                              Popular
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[planStyles.planDesc, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                        {plan.description}
                      </Text>
                    </View>
                    <Text style={[planStyles.price, { color: plan.price ? colors.primary : colors.textSubtle, fontFamily: FONTS.bold }]}>
                      {plan.price ?? "Free"}
                    </Text>
                  </View>

                  <View style={[planStyles.divider, { backgroundColor: colors.border }]} />

                  <View style={{ gap: SPACING.xs }}>
                    {plan.features.map((f) => (
                      <View key={f} style={planStyles.featureRow}>
                        <Ionicons name="checkmark-circle" size={15} color={colors.primary} />
                        <Text style={[planStyles.featureText, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
                          {f}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {!isCurrent && (
                    <Pressable
                      style={[
                        planStyles.upgradeBtn,
                        { backgroundColor: isHighlighted ? colors.primary : colors.surface },
                        { borderColor: colors.border },
                      ]}
                    >
                      <Text style={[planStyles.upgradeText, { color: isHighlighted ? colors.onPrimary : colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                        {plan.key === "free" ? "Downgrade" : "Coming soon"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const colors = useThemeColors();
  const { preference, setPreference } = useThemeStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  const { profile } = useProfile();
  const { deleteAccount, isDeleting } = useDeleteAccount();

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [connectionsOpen, setConnectionsOpen] = useState(false);

  const updateCurrencyMutation = useMutation({
    mutationFn: (ref_currency: string) => UserService.updateProfile({ ref_currency: ref_currency as "NGN" | "USD" | "GBP" | "EUR" | "GHS" | "KES" | "ZAR" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
      setCurrencyOpen(false);
    },
  });

  const initials = profile
    ? `${profile.firstName[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const fullName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ")
    : "—";

  const currentCurrency = CURRENCIES.find((c) => c.code === profile?.refCurrency);

  const themeLabel = preference === "system" ? "System default" : preference === "dark" ? "Dark" : "Light";

  function cycleTheme() {
    const next = preference === "light" ? "dark" : preference === "dark" ? "system" : "light";
    setPreference(next);
  }

  function handleSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => {
          queryClient.clear();
          clearSession();
        },
      },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Delete account",
      "Your account and all data will be permanently deleted within 30 days. You can contact us before then to cancel.\n\nThis action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Schedule deletion",
          style: "destructive",
          onPress: () => deleteAccount(),
        },
      ],
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text style={[styles.pageTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
          Profile
        </Text>

        {/* Avatar card */}
        <GlassCard style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.onPrimary, fontFamily: FONTS.bold }]}>
                {initials}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                {fullName}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                {profile?.email ?? "—"}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Plan */}
        <View style={styles.section}>
          <SectionHeader title="Plan" />
          <GlassCard>
            <SettingRow
              icon="diamond-outline"
              label="Your plan"
              sub={profile?.planTier === "free" ? "Free — upgrade for more power" : `${profile?.planTier} plan`}
              value={profile?.planTier === "free" ? "Free" : undefined}
              onPress={() => setPlansOpen(true)}
            />
          </GlassCard>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <SectionHeader title="Preferences" />
          <GlassCard>
            <SettingRow
              icon="globe-outline"
              label="Reference currency"
              sub="Used for all totals and conversions"
              value={currentCurrency ? `${currentCurrency.symbol} ${currentCurrency.code}` : profile?.refCurrency}
              onPress={() => setCurrencyOpen(true)}
            />
            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
            <SettingRow
              icon="moon-outline"
              label="Appearance"
              sub="How the app looks"
              value={themeLabel}
              onPress={cycleTheme}
            />
          </GlassCard>
        </View>

        {/* Connections */}
        <View style={styles.section}>
          <SectionHeader title="Connections" />
          <GlassCard>
            <SettingRow
              icon="mail-outline"
              label="Email connections"
              sub="Manage connected Gmail accounts"
              onPress={() => setConnectionsOpen(true)}
            />
          </GlassCard>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <SectionHeader title="Legal" />
          <GlassCard>
            <SettingRow
              icon="document-text-outline"
              label="Terms of Service"
              onPress={() => navigation.navigate("TermsOfService")}
            />
            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
            <SettingRow
              icon="shield-checkmark-outline"
              label="Privacy Policy"
              onPress={() => navigation.navigate("PrivacyPolicy")}
            />
          </GlassCard>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <SectionHeader title="Account" />
          <GlassCard>
            <SettingRow
              icon="trash-outline"
              label="Delete account"
              sub="Permanently removes your account and all data"
              onPress={isDeleting ? undefined : handleDeleteAccount}
              destructive
            />
          </GlassCard>
        </View>

        {/* Sign out */}
        <Pressable
          onPress={handleSignOut}
          style={[styles.signOutBtn, { borderColor: colors.border }]}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={[styles.signOutText, { color: colors.error, fontFamily: FONTS.semiBold }]}>
            Sign out
          </Text>
        </Pressable>

        <Text style={[styles.version, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
          Vela · v1.0.0
        </Text>
      </ScrollView>

      <CurrencySheet
        visible={currencyOpen}
        current={profile?.refCurrency ?? "NGN"}
        onSelect={(code) => updateCurrencyMutation.mutate(code)}
        onClose={() => setCurrencyOpen(false)}
      />

      <PlansSheet
        visible={plansOpen}
        currentTier={profile?.planTier ?? "free"}
        onClose={() => setPlansOpen(false)}
      />

      <EmailConnectionsSheet
        visible={connectionsOpen}
        onClose={() => setConnectionsOpen(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 80,
    gap: 0,
  },
  pageTitle: {
    fontSize: FONT_SIZE.h1,
    letterSpacing: -0.6,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    paddingHorizontal: 4,
  },
  card: { marginBottom: SPACING.lg },
  section: { marginBottom: SPACING.lg },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 20 },
  userName: { fontSize: 17, letterSpacing: -0.3 },
  userEmail: { fontSize: 13, marginTop: 2 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  settingMid: { flex: 1, minWidth: 0 },
  settingLabel: { fontSize: 14, letterSpacing: -0.1 },
  settingSub: { fontSize: 12, marginTop: 1 },
  settingValue: { fontSize: 13, flexShrink: 0 },
  rowDivider: { height: StyleSheet.hairlineWidth, marginLeft: SPACING.base + 34 + SPACING.sm },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  signOutText: { fontSize: 15 },
  version: { fontSize: 12, textAlign: "center", paddingBottom: SPACING.xl },
});

const sheetStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  handle: { width: 36, height: 4, borderRadius: 99, alignSelf: "center", marginTop: 12, marginBottom: 4 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  closeBtn: { width: 34, height: 34, borderRadius: 99, alignItems: "center", justifyContent: "center" },
  subtitle: { fontSize: 13, lineHeight: 20, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  symbolBadge: { width: 38, height: 38, borderRadius: 99, alignItems: "center", justifyContent: "center" },
  symbol: { fontSize: 15 },
  currencyCode: { fontSize: 15, letterSpacing: -0.2 },
  currencyName: { fontSize: 12, marginTop: 1 },
});

const planStyles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    gap: SPACING.md,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: SPACING.sm },
  labelRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, marginBottom: 4 },
  planLabel: { fontSize: 17, letterSpacing: -0.3 },
  planDesc: { fontSize: 13, lineHeight: 18 },
  price: { fontSize: 16, letterSpacing: -0.3 },
  currentBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  currentText: { fontSize: 10, letterSpacing: 0.4 },
  divider: { height: StyleSheet.hairlineWidth },
  featureRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  featureText: { fontSize: 13, lineHeight: 18 },
  upgradeBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.sm + 2,
    alignItems: "center",
    borderWidth: 1,
    marginTop: SPACING.xs,
  },
  upgradeText: { fontSize: 14 },
});
