import React from "react";
import { Platform, TurboModuleRegistry } from "react-native";
import { navigationRef } from "@/core/navigation/navigation-ref";
import { NotificationsService } from "../notifications.service";

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? "";

// TurboModuleRegistry.get() returns null instead of throwing when the native
// module is missing. We check this BEFORE requiring the JS wrapper so we never
// reach onesignal's own getEnforcing() calls (which crash the app).
function isOneSignalAvailable(): boolean {
  try {
    return TurboModuleRegistry.get("OneSignal") !== null;
  } catch {
    return false;
  }
}

export function useOnesignal(isAuthenticated: boolean) {
  React.useEffect(() => {
    if (!ONESIGNAL_APP_ID || !isOneSignalAvailable()) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { OneSignal } = require("react-native-onesignal");
      OneSignal.initialize(ONESIGNAL_APP_ID);
      OneSignal.Notifications.requestPermission(true);
    } catch {}
  }, []);

  React.useEffect(() => {
    if (!isAuthenticated || !isOneSignalAvailable()) return;

    const register = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { OneSignal } = require("react-native-onesignal");
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

  React.useEffect(() => {
    if (!isOneSignalAvailable()) return;

    let cleanup: (() => void) | undefined;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { OneSignal } = require("react-native-onesignal");

      const handler = (event: import("react-native-onesignal").NotificationClickEvent) => {
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
      cleanup = () => OneSignal.Notifications.removeEventListener("click", handler);
    } catch {}

    return cleanup;
  }, []);
}
