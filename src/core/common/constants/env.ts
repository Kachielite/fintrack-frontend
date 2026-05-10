export const ENV = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_BACKEND_URL ?? "https://api.fintrack.app/api",
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_WEB_CLIENT_ID ?? "",
  GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_IOS_CLIENT_ID ?? "",
  APPLE_BUNDLE_ID: process.env.EXPO_APPLE_BUNDLE_ID ?? "app.fintrack",
} as const;
