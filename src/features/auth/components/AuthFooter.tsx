import React from "react";
import { Text, View, Pressable, Linking, StyleSheet } from "react-native";
import { FONTS, FONT_SIZE, SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

// Placeholder URLs — replace with real hosted pages before release
const TERMS_URL = "https://fintrack.app/terms";
const PRIVACY_URL = "https://fintrack.app/privacy";

export default function AuthFooter() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.base, { color: colors.textSubtle }]}>
        {"By continuing you agree to our "}
        <Pressable onPress={() => Linking.openURL(TERMS_URL)} hitSlop={4}>
          <Text style={[styles.link, { color: colors.textPrimary }]}>
            Terms
          </Text>
        </Pressable>
        {"  and  "}
        <Pressable onPress={() => Linking.openURL(PRIVACY_URL)} hitSlop={4}>
          <Text style={[styles.link, { color: colors.textPrimary }]}>
            Privacy Policy
          </Text>
        </Pressable>
        {"."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  base: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.caption,
    textAlign: "center",
    lineHeight: 18,
  },
  link: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
  },
});
