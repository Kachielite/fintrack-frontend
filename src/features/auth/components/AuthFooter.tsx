import React from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FONTS, FONT_SIZE, RADIUS } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface Props {
  agreed: boolean;
  onToggle: () => void;
}

export default function AuthFooter({ agreed, onToggle }: Props) {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();

  return (
    <Pressable onPress={onToggle} style={styles.row} hitSlop={4}>
        {/* Checkbox */}
        <View
          style={[
            styles.checkbox,
            {
              borderColor: agreed ? colors.primary : colors.border,
              backgroundColor: agreed ? colors.primary : "transparent",
            },
          ]}
        >
          {agreed && <Ionicons name="checkmark" size={13} color="#fff" />}
        </View>

        {/* Label — link onPress claims the touch before Pressable fires */}
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
          {"By continuing, I agree to the "}
          <Text
            onPress={() => navigation.navigate("TermsOfService")}
            style={[styles.link, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}
          >
            Terms of Service
          </Text>
          {" and "}
          <Text
            onPress={() => navigation.navigate("PrivacyPolicy")}
            style={[styles.link, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}
          >
            Privacy Policy
          </Text>
          {"."}
        </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  label: {
    flex: 1,
    fontSize: FONT_SIZE.body - 1,
    lineHeight: 20,
  },
  link: {
    fontSize: FONT_SIZE.body - 1,
  },
});
