import React from "react";
import { Platform } from "react-native";
import { OneSignal, NotificationClickEvent } from "react-native-onesignal";
import { useQueryClient } from "@tanstack/react-query";
import { navigationRef } from "@/core/navigation/navigation-ref";
import { NotificationsService } from "../notifications.service";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? "";

async function registerToken() {
  try {
    const playerId = await OneSignal.User.pushSubscription.getIdAsync();
    if (playerId) {
      const platform = Platform.OS === "ios" ? "ios" : "android";
      await NotificationsService.registerDeviceToken(playerId, platform);
    }
  } catch {
    // Non-critical
  }
}

export function useOnesignal(isAuthenticated: boolean) {
  const qc = useQueryClient();

  React.useEffect(() => {
    OneSignal.initialize(ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);
  }, []);

  // Register on login — catches the case where subscription was already active
  React.useEffect(() => {
    if (!isAuthenticated) return;
    registerToken();
  }, [isAuthenticated]);

  // Also register whenever the subscription changes (e.g. permission just granted)
  React.useEffect(() => {
    if (!isAuthenticated) return;

    const handler = (event: any) => {
      if (event?.current?.isSubscribed) {
        registerToken();
      }
    };

    OneSignal.User.pushSubscription.addEventListener("change", handler);
    return () => OneSignal.User.pushSubscription.removeEventListener("change", handler);
  }, [isAuthenticated]);

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
          // Invalidate so the Insights screen always shows the latest insight
          // even if the screen is already mounted with stale cached data.
          qc.invalidateQueries({ queryKey: [QUERY_KEYS.INSIGHTS] });
          nav.navigate("Insights");
          break;
        case "budget_warning":
        case "budget_exceeded":
          nav.navigate("Tabs", { screen: "Budget" });
          break;
        default:
          nav.navigate("Notifications");
      }
    };

    OneSignal.Notifications.addEventListener("click", handler);
    return () => OneSignal.Notifications.removeEventListener("click", handler);
  }, [qc]);
}
