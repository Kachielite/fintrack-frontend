import React from "react";
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
import { FONTS, FONT_SIZE, RADIUS, SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import VelaIcon from "@/core/common/components/VelaIcon";
import { useSignIn } from "../hooks/use-sign-in";

export default function SignInScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { form, signIn, isLoading } = useSignIn();
  const { control, formState } = form;

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
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.body}>
            <View style={styles.logoWrap}>
              <View style={[styles.iconShadow, { shadowColor: "#3F5538" }]}>
                <VelaIcon size={72} variant="auto" />
              </View>
              <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                Sign in
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
                Welcome back. Enter your details to continue.
              </Text>
            </View>

            <View style={styles.form}>
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
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.surface,
                          borderColor: formState.errors.email ? colors.error : colors.border,
                          color: colors.textPrimary,
                          fontFamily: FONTS.regular,
                        },
                      ]}
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
                      placeholder="Password"
                      placeholderTextColor={colors.textSubtle}
                      secureTextEntry
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.surface,
                          borderColor: formState.errors.password ? colors.error : colors.border,
                          color: colors.textPrimary,
                          fontFamily: FONTS.regular,
                        },
                      ]}
                    />
                  )}
                />
                {formState.errors.password && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {formState.errors.password.message}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={() => signIn()}
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
                    Sign in
                  </Text>
                )}
              </Pressable>

              <Pressable onPress={() => navigation.navigate("SignUp")} hitSlop={8} style={styles.switchRow}>
                <Text style={[styles.switchText, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
                  {"New here? "}
                  <Text style={[styles.switchLink, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                    Create an account
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
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    gap: SPACING.lg,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  iconShadow: {
    borderRadius: 16,
    marginBottom: SPACING.xl,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 12,
  },
  title: {
    fontSize: FONT_SIZE.h1,
    letterSpacing: -0.6,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 280,
  },
  form: { gap: SPACING.lg },
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
