import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IrisChatMessage } from "../iris.interface";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import ChartCard from "./ChartCard";
import MarkdownText from "./MarkdownText";

interface Props {
  message: IrisChatMessage;
}

export default function ChatBubble({ message }: Props) {
  const colors = useThemeColors();
  const isUser = message.role === "user";

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperAssistant]}>
      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.surface2 },
        ]}
      >
        {isUser ? (
          <Text style={[styles.text, { color: "#FFFFFF" }]}>{message.content}</Text>
        ) : (
          <MarkdownText
            content={message.content}
            color={colors.textPrimary}
            fontSize={15}
            lineHeight={22}
          />
        )}
        {!isUser && message.chartData && (
          <ChartCard chart={message.chartData} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  wrapperUser: {
    alignItems: "flex-end",
  },
  wrapperAssistant: {
    alignItems: "flex-start",
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "85%",
    gap: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
});
