import { Platform } from "react-native";

const DEV_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://localhost:3000/api";

export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_WEB_CLIENT_ID ?? "",
  GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_IOS_CLIENT_ID ?? "",
  APPLE_BUNDLE_ID: process.env.EXPO_APPLE_BUNDLE_ID ?? "app.fintrack",
};
