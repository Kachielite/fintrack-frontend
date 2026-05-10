import React from "react";
import { Text, View, Pressable, Linking, StyleSheet } from "react-native";
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  SPACING,
} from "@/core/common/constants/theme";

// Placeholder URLs — replace with real hosted pages before release
const TERMS_URL = "https://fintrack.app/terms";
const PRIVACY_URL = "https://fintrack.app/privacy";

export default function AuthFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.base}>
        {"By continuing you agree to our "}
        <Pressable onPress={() => Linking.openURL(TERMS_URL)} hitSlop={4}>
          <Text style={styles.link}>Terms</Text>
        </Pressable>
        {"  and  "}
        <Pressable onPress={() => Linking.openURL(PRIVACY_URL)} hitSlop={4}>
          <Text style={styles.link}>Privacy Policy</Text>
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
    color: COLORS.textSubtle,
    textAlign: "center",
    lineHeight: 18,
  },
  link: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textPrimary,
  },
});
