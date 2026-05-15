import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FONTS, FONT_SIZE, SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

export default function AuthFooter() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={[styles.base, { color: colors.textSubtle }]}>
        {"By continuing you agree to our "}
        <Text
          onPress={() => navigation.navigate("TermsOfService")}
          style={[styles.link, { color: colors.textPrimary }]}
        >
          Terms
        </Text>
        {" and "}
        <Text
          onPress={() => navigation.navigate("PrivacyPolicy")}
          style={[styles.link, { color: colors.textPrimary }]}
        >
          Privacy Policy
        </Text>
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
