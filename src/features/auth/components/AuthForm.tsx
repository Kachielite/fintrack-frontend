import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FONTS, FONT_SIZE, RADIUS, SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import AuthLogo from "./AuthLogo";
import GoogleSignInButton from "./GoogleSignInButton";
import AppleSignInButton from "./AppleSignInButton";
import AuthFooter from "./AuthFooter";
import { useGoogleSignIn } from "../hooks/use-google-sign-in";
import { useAppleSignIn } from "../hooks/use-apple-sign-in";
import { useDemoSignIn } from "../hooks/use-demo-sign-in";

const oauthLabel =
  Platform.OS === "ios" ? "Continue with Apple or Google" : "Continue with Google";

export default function AuthForm() {
  const colors = useThemeColors();
  const { signIn: signInGoogle, isLoading: googleLoading } = useGoogleSignIn();
  const { signIn: signInApple, isLoading: appleLoading } = useAppleSignIn();
  const { email, setEmail, password, setPassword, signIn: signInDemo, isLoading: demoLoading } =
    useDemoSignIn();

  const [demoExpanded, setDemoExpanded] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.body}>
          <AuthLogo />

          {/* ── OAuth mode ─────────────────────────────────────── */}
          {!demoExpanded && (
            <>
              <View
                style={{ opacity: agreed ? 1 : 0.4 }}
                pointerEvents={agreed ? "auto" : "none"}
              >
                <View style={styles.buttons}>
                  <GoogleSignInButton onPress={() => signInGoogle()} isLoading={googleLoading} />
                  <AppleSignInButton onPress={() => signInApple()} isLoading={appleLoading} />
                </View>
              </View>

              {/* T&C sits right under OAuth buttons */}
              <AuthFooter agreed={agreed} onToggle={() => setAgreed((v) => !v)} />

              {/* Toggle to password mode */}
              <Pressable
                onPress={() => setDemoExpanded(true)}
                style={styles.dividerRow}
                hitSlop={8}
              >
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSubtle, fontFamily: FONTS.regular, marginTop: SPACING.xxxl }]}>
                  sign in with password
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </Pressable>
            </>
          )}

          {/* ── Password mode ──────────────────────────────────── */}
          {demoExpanded && (
            <View style={styles.passwordForm}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={colors.textSubtle}
                autoCapitalize="none"
                keyboardType="email-address"
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    fontFamily: FONTS.regular,
                  },
                ]}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={colors.textSubtle}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    fontFamily: FONTS.regular,
                  },
                ]}
              />
              <Pressable
                onPress={() => signInDemo()}
                disabled={demoLoading || !agreed}
                style={[
                  styles.signInBtn,
                  {
                    backgroundColor: agreed ? colors.primary : colors.surface2,
                    borderColor: agreed ? colors.primary : colors.border,
                    opacity: demoLoading ? 0.7 : !agreed ? 0.4 : 1,
                  },
                ]}
              >
                {demoLoading ? (
                  <ActivityIndicator size="small" color={agreed ? colors.onPrimary : colors.textSecondary} />
                ) : (
                  <Text style={[styles.signInText, { color: agreed ? colors.onPrimary : colors.textSecondary, fontFamily: FONTS.semiBold }]}>
                    Sign in
                  </Text>
                )}
              </Pressable>

              {/* Extra gap before T&C */}
              <View style={{ marginTop: SPACING.sm }}>
                <AuthFooter agreed={agreed} onToggle={() => setAgreed((v) => !v)} />
              </View>

              {/* Switch back to OAuth — replaces "hide" */}
              <Pressable
                onPress={() => setDemoExpanded(false)}
                style={[styles.dividerRow, { marginTop: SPACING.xxxl }]}
                hitSlop={8}
              >
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                  {oauthLabel}
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.lg,
  },
  buttons: { gap: SPACING.md + 2 },

  passwordForm: { gap: SPACING.lg },
  input: {
    height: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.base,
    fontSize: FONT_SIZE.body - 1,
  },
  signInBtn: {
    height: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: { fontSize: FONT_SIZE.body - 1 },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: { fontSize: 11, letterSpacing: 0.3 },
});
