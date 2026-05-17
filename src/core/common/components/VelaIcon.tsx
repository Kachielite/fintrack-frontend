import React from "react";
import Svg, { Rect, Path } from "react-native-svg";
import { useIsDark } from "@/core/common/hooks/use-theme-colors";

/**
 * variant "auto"     — follows the current theme (primary in light, night in dark)
 * variant "primary"  — olive bg, cream sail, amber mast  (light surfaces)
 * variant "on-dark"  — cream bg, olive sail, amber mast  (dark/olive surfaces)
 * variant "night"    — near-black bg, cream sail, amber mast (dark mode)
 * variant "mark"     — transparent bg, cream sail, amber mast (custom bg)
 */
export type VelaIconVariant = "auto" | "primary" | "on-dark" | "night" | "mark";

interface Props {
  size?: number;
  variant?: VelaIconVariant;
}

const OLIVE = "#3F5538";
const CREAM = "#F5EFE6";
const AMBER = "#C77638";
const NIGHT = "#1C1916";

const SAIL = "M 580 130 C 880 360, 880 720, 800 880 C 620 920, 360 920, 180 880 C 280 620, 420 380, 580 130 Z";
const MAST = "M 520 200 C 380 380, 280 600, 180 880 L 440 880 C 440 720, 490 460, 540 220 Z";

export default function VelaIcon({ size = 40, variant = "auto" }: Props) {
  const isDark = useIsDark();

  const resolved: Exclude<VelaIconVariant, "auto"> =
    variant === "auto" ? (isDark ? "night" : "primary") : variant;

  let bg: string | null;
  let sailFill: string;
  let mastFill: string;

  switch (resolved) {
    case "on-dark":
      bg = CREAM;
      sailFill = OLIVE;
      mastFill = AMBER;
      break;
    case "night":
      bg = NIGHT;
      sailFill = CREAM;
      mastFill = AMBER;
      break;
    case "mark":
      bg = null;
      sailFill = CREAM;
      mastFill = AMBER;
      break;
    default: // "primary"
      bg = OLIVE;
      sailFill = CREAM;
      mastFill = AMBER;
      break;
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      {bg && <Rect width={1024} height={1024} rx={230} ry={230} fill={bg} />}
      <Path d={SAIL} fill={sailFill} />
      <Path d={MAST} fill={mastFill} />
    </Svg>
  );
}
