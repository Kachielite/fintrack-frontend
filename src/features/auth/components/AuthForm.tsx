import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { FONTS, SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import AuthLogo from "./AuthLogo";
import GoogleSignInButton from "./GoogleSignInButton";
import AppleSignInButton from "./AppleSignInButton";
import AuthFooter from "./AuthFooter";
import { useGoogleSignIn } from "../hooks/use-google-sign-in";
import { useAppleSignIn } from "../hooks/use-apple-sign-in";

export default function AuthForm() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { signIn: signInGoogle, isLoading: googleLoading } = useGoogleSignIn();
  const { signIn: signInApple, isLoading: appleLoading } = useAppleSignIn();

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

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.body}>
          <AuthLogo />

          <View style={styles.buttons}>
            <GoogleSignInButton onPress={() => requireConsent(signInGoogle)} isLoading={googleLoading} />
            <AppleSignInButton onPress={() => requireConsent(signInApple)} isLoading={appleLoading} />
          </View>

          <AuthFooter agreed={agreed} onToggle={() => setAgreed((v) => !v)} />

          <Pressable
            onPress={() => navigation.navigate("SignIn")}
            style={styles.dividerRow}
            hitSlop={8}
          >
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary, fontFamily: FONTS.semiBold }]}>
              Continue with Email
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </Pressable>
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
    gap: SPACING.xxl,
  },
  buttons: { gap: SPACING.md + 2 },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.xl,
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: { fontSize: 11, letterSpacing: 0.3 },
});
