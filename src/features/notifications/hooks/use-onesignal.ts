import React from "react";
import { Platform } from "react-native";
import { OneSignal, NotificationClickEvent } from "react-native-onesignal";
import { navigationRef } from "@/core/navigation/navigation-ref";
import { NotificationsService } from "../notifications.service";

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? "";

/**
 * Initialises OneSignal, requests permission, registers the device token with
 * the backend whenever the user is authenticated, and handles deep-link
 * navigation when the user taps a push notification.
 *
 * Mount once at the app root and pass `isAuthenticated` from your auth state.
 */
export function useOnesignal(isAuthenticated: boolean) {
  // Initialise SDK and request permission once on mount.
  React.useEffect(() => {
    OneSignal.initialize(ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);
  }, []);

  // Register (or refresh) the device token whenever the user logs in.
  React.useEffect(() => {
    if (!isAuthenticated) return;

    const register = async () => {
      try {
        const playerId = await OneSignal.User.pushSubscription.getIdAsync();
        if (playerId) {
          const platform = Platform.OS === "ios" ? "ios" : "android";
          await NotificationsService.registerDeviceToken(playerId, platform);
        }
      } catch {
        // Non-critical — push may not be available on simulator/emulator.
      }
    };

    register();
  }, [isAuthenticated]);

  // Navigate to the relevant screen when the user taps a notification.
  React.useEffect(() => {
    const handler = (event: NotificationClickEvent) => {
      const data = event.notification.additionalData as
        | { type?: string }
        | undefined;

      if (!data?.type || !navigationRef.isReady()) return;

      const nav = navigationRef as any;

      switch (data.type) {
        case "sync_complete":
        case "sync_failed":
          nav.navigate("Notifications");
          break;
        case "insight_generated":
          nav.navigate("Insights");
          break;
        default:
          nav.navigate("Notifications");
      }
    };

    OneSignal.Notifications.addEventListener("click", handler);
    return () => OneSignal.Notifications.removeEventListener("click", handler);
  }, []);
}
