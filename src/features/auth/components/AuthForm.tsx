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

export default function AuthForm() {
  const colors = useThemeColors();
  const { signIn: signInGoogle, isLoading: googleLoading } = useGoogleSignIn();
  const { signIn: signInApple, isLoading: appleLoading } = useAppleSignIn();
  const { email, setEmail, password, setPassword, signIn: signInDemo, isLoading: demoLoading } =
    useDemoSignIn();

  const [demoExpanded, setDemoExpanded] = useState(false);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      <View style={styles.body}>
        <AuthLogo />

        {/* Primary OAuth buttons */}
        <View style={styles.buttons}>
          <GoogleSignInButton
            onPress={() => signInGoogle()}
            isLoading={googleLoading}
          />
          <AppleSignInButton
            onPress={() => signInApple()}
            isLoading={appleLoading}
          />
        </View>

        {/* Demo / reviewer login */}
        <View style={styles.demoSection}>
          <Pressable
            onPress={() => setDemoExpanded((v) => !v)}
            style={styles.demoToggle}
            hitSlop={8}
          >
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.demoToggleText, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
              {demoExpanded ? "hide demo" : "demo / reviewer login"}
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </Pressable>

          {demoExpanded && (
            <View style={styles.demoForm}>
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
                disabled={demoLoading}
                style={[
                  styles.demoSignInBtn,
                  {
                    backgroundColor: colors.surface2,
                    borderColor: colors.border,
                    opacity: demoLoading ? 0.6 : 1,
                  },
                ]}
              >
                {demoLoading ? (
                  <ActivityIndicator size="small" color={colors.textSecondary} />
                ) : (
                  <Text
                    style={[
                      styles.demoSignInText,
                      { color: colors.textSecondary, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    Sign in
                  </Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <AuthFooter />
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
  buttons: { gap: SPACING.sm + 2 },

  // Demo section
  demoSection: { gap: SPACING.sm },
  demoToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth },
  demoToggleText: { fontSize: 11, letterSpacing: 0.3 },

  demoForm: { gap: SPACING.sm },
  input: {
    height: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.base,
    fontSize: FONT_SIZE.body - 1,
  },
  demoSignInBtn: {
    height: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  demoSignInText: { fontSize: FONT_SIZE.body - 1 },
});
