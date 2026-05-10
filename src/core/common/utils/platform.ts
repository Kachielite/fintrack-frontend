import { Platform } from "react-native";

export const isIOS26 =
  Platform.OS === "ios" && parseInt(Platform.Version as string, 10) >= 26;
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
