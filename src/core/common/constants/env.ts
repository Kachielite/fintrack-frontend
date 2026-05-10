export const ENV = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://api.fintrack.app/api",
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
  APPLE_BUNDLE_ID: process.env.EXPO_PUBLIC_APPLE_BUNDLE_ID ?? "app.fintrack",
} as const;
