import React from "react";
import { Text, View, StyleSheet } from "react-native";

interface Props {
  content: string;
  color: string;
  fontSize?: number;
  lineHeight?: number;
}

// Splits a line by **bold** and *italic* markers and renders inline spans.
function InlineLine({ text, color, fontSize, lineHeight }: { text: string; color: string; fontSize: number; lineHeight: number }) {
  const parts: { value: string; bold: boolean; italic: boolean }[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ value: text.slice(last, m.index), bold: false, italic: false });
    if (m[0].startsWith("**")) {
      parts.push({ value: m[2], bold: true, italic: false });
    } else {
      parts.push({ value: m[3], bold: false, italic: true });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ value: text.slice(last), bold: false, italic: false });

  return (
    <Text style={{ color, fontSize, lineHeight }}>
      {parts.map((p, i) => (
        <Text
          key={i}
          style={{
            fontWeight: p.bold ? "700" : "400",
            fontStyle: p.italic ? "italic" : "normal",
          }}
        >
          {p.value}
        </Text>
      ))}
    </Text>
  );
}

export default function MarkdownText({ content, color, fontSize = 15, lineHeight = 22 }: Props) {
  const lines = content.split("\n");

  return (
    <View style={styles.root}>
      {lines.map((line, i) => {
        const trimmed = line.trimStart();

        // Blank line → small spacer
        if (trimmed === "") {
          return <View key={i} style={styles.spacer} />;
        }

        // Bullet: "- text" or "• text"
        if (/^[-•]\s/.test(trimmed)) {
          const bulletText = trimmed.slice(2);
          return (
            <View key={i} style={styles.bullet}>
              <Text style={[styles.bulletDot, { color, fontSize }]}>•</Text>
              <View style={{ flex: 1 }}>
                <InlineLine text={bulletText} color={color} fontSize={fontSize} lineHeight={lineHeight} />
              </View>
            </View>
          );
        }

        // Numbered list: "1. text"
        const numMatch = trimmed.match(/^(\d+)\.\s(.+)/);
        if (numMatch) {
          return (
            <View key={i} style={styles.bullet}>
              <Text style={[styles.bulletDot, { color, fontSize }]}>{numMatch[1]}.</Text>
              <View style={{ flex: 1 }}>
                <InlineLine text={numMatch[2]} color={color} fontSize={fontSize} lineHeight={lineHeight} />
              </View>
            </View>
          );
        }

        // Normal line
        return <InlineLine key={i} text={trimmed} color={color} fontSize={fontSize} lineHeight={lineHeight} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 2 },
  spacer: { height: 6 },
  bullet: {
    flexDirection: "row",
    gap: 6,
    alignItems: "flex-start",
  },
  bulletDot: {
    width: 16,
    marginTop: 1,
  },
});
