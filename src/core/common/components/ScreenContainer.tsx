import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isIOS26 } from "@/core/common/utils/platform";
import { SPACING } from "@/core/common/constants/theme";

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: boolean;
}

export default function ScreenContainer(_props: ScreenContainerProps): null {
  return null;
}
