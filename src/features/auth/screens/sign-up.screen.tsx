import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { FONTS, FONT_SIZE, RADIUS, SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { useSignUp } from "../hooks/use-sign-up";
import AuthFooter from "../components/AuthFooter";

export default function SignUpScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { form, signUp, isLoading } = useSignUp();
  const { control, formState } = form;

  const [agreed, setAgreed] = useState(false);

  function requireConsent(action: () => void) {
    if (!agreed) {
      Toast.show({
        type: "error",
        text1: "Please accept the Terms of Service and Privacy Policy to continue",
      });
      return;
    }
    action();
  }

  const fieldStyle = (hasError: boolean) => [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: hasError ? colors.error : colors.border,
      color: colors.textPrimary,
      fontFamily: FONTS.regular,
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
          Create an account
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
            Get started tracking your spending.
          </Text>

          <View style={styles.formWrapper}>
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.medium }]}>
                  First name
                </Text>
                <Controller
                  control={control}
                  name="first_name"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Jane"
                      placeholderTextColor={colors.textSubtle}
                      style={fieldStyle(!!formState.errors.first_name)}
                    />
                  )}
                />
                {formState.errors.first_name && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {formState.errors.first_name.message}
                  </Text>
                )}
              </View>

              <View style={[styles.field, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.medium }]}>
                  Last name
                </Text>
                <Controller
                  control={control}
                  name="last_name"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Doe"
                      placeholderTextColor={colors.textSubtle}
                      style={fieldStyle(false)}
                    />
                  )}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.medium }]}>
                Email
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textSubtle}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    style={fieldStyle(!!formState.errors.email)}
                  />
                )}
              />
              {formState.errors.email && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {formState.errors.email.message}
                </Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.medium }]}>
                Password
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="At least 8 characters"
                    placeholderTextColor={colors.textSubtle}
                    secureTextEntry
                    style={fieldStyle(!!formState.errors.password)}
                  />
                )}
              />
              {formState.errors.password && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {formState.errors.password.message}
                </Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.medium }]}>
                Confirm password
              </Text>
              <Controller
                control={control}
                name="confirm_password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Re-enter your password"
                    placeholderTextColor={colors.textSubtle}
                    secureTextEntry
                    style={fieldStyle(!!formState.errors.confirm_password)}
                  />
                )}
              />
              {formState.errors.confirm_password && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {formState.errors.confirm_password.message}
                </Text>
              )}
            </View>

            <AuthFooter agreed={agreed} onToggle={() => setAgreed((v) => !v)} />

            <Pressable
              onPress={() => requireConsent(() => signUp())}
              disabled={isLoading}
              style={[
                styles.submitBtn,
                {
                  backgroundColor: colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <Text style={[styles.submitText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
                  Create account
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.switchRow}>
              <Text style={[styles.switchText, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
                {"Already have an account? "}
                <Text style={[styles.switchLink, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                  Sign in
                </Text>
              </Text>
            </Pressable>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  headerTitle: { fontSize: FONT_SIZE.h1, letterSpacing: -0.6 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: SPACING.xxl,
  },
  formWrapper: { flex: 1, justifyContent: "center", paddingBottom: SPACING.xxl },
  form: { gap: SPACING.lg },
  row: { flexDirection: "row", gap: SPACING.md },
  field: { gap: SPACING.xs },
  label: { fontSize: FONT_SIZE.body - 2 },
  input: {
    height: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.base,
    fontSize: FONT_SIZE.body - 1,
  },
  errorText: {
    fontSize: 12,
  },
  submitBtn: {
    height: 46,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm,
  },
  submitText: { fontSize: FONT_SIZE.body - 1 },
  switchRow: { alignItems: "center", marginTop: SPACING.lg },
  switchText: { fontSize: FONT_SIZE.body - 1 },
  switchLink: { fontSize: FONT_SIZE.body - 1 },
});
