import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface DonutSlice {
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  children?: React.ReactNode;
}

export default function DonutChart({
  data,
  size = 130,
  thickness = 20,
  children,
}: DonutChartProps) {
  const colors = useThemeColors();
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const GAP = 1.5;

  let cumulative = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={colors.surface2}
          strokeWidth={thickness}
        />
        {data.map((slice, i) => {
          const len = (slice.value / total) * circumference;
          const dashArray = `${Math.max(0, len - GAP)} ${circumference}`;
          const dashOffset = -cumulative;
          cumulative += len;
          return (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={thickness}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
            />
          );
        })}
      </Svg>
      {children && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
}
