import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import AuthLogo from "./AuthLogo";
import GoogleSignInButton from "./GoogleSignInButton";
import AppleSignInButton from "./AppleSignInButton";
import AuthFooter from "./AuthFooter";
import { useGoogleSignIn } from "../hooks/use-google-sign-in";
import { useAppleSignIn } from "../hooks/use-apple-sign-in";

export default function AuthForm() {
  const colors = useThemeColors();
  const { signIn: signInGoogle, isLoading: googleLoading } = useGoogleSignIn();
  const { signIn: signInApple, isLoading: appleLoading } = useAppleSignIn();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.body}>
        <AuthLogo />

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
      </View>

      <AuthFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.xxl,
  },
  buttons: {
    gap: SPACING.sm + 2,
  },
});
