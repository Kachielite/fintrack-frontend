import React from "react";
import { Platform } from "react-native";
import { navigationRef } from "@/core/navigation/navigation-ref";
import { NotificationsService } from "../notifications.service";

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? "";

/**
 * Check at the C++ TurboModule level whether the OneSignal native module is
 * compiled into this binary.
 *
 * Why __turboModuleProxy instead of TurboModuleRegistry.get():
 * TurboModuleRegistry.get() falls back to NativeModules[name] which, under the
 * New-Arch interop layer, can return a JS proxy object even when the native
 * module is absent — causing isAvailable() to return true and then
 * getEnforcing() (called inside onesignal's dist/index.js at module level)
 * to throw uncaught. Going directly to __turboModuleProxy skips that fallback
 * and gives a definitive answer.
 */
function isOneSignalNativeAvailable(): boolean {
  try {
    const proxy = (global as any).__turboModuleProxy;
    if (proxy == null) return false;
    return proxy.get("OneSignal") !== null;
  } catch {
    return false;
  }
}

export function useOnesignal(isAuthenticated: boolean) {
  React.useEffect(() => {
    if (!ONESIGNAL_APP_ID || !isOneSignalNativeAvailable()) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { OneSignal } = require("react-native-onesignal");
      OneSignal.initialize(ONESIGNAL_APP_ID);
      // false = don't fallback to Settings if previously denied; true would open Settings prompt
      OneSignal.Notifications.requestPermission(false);
    } catch {}
  }, []);

  React.useEffect(() => {
    if (!isAuthenticated || !isOneSignalNativeAvailable()) return;

    const register = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { OneSignal } = require("react-native-onesignal");
        const playerId = await OneSignal.User.pushSubscription.getIdAsync();
        if (playerId) {
          const platform = Platform.OS === "ios" ? "ios" : "android";
          await NotificationsService.registerDeviceToken(playerId, platform);
        }
      } catch {}
    };

    register();
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (!isOneSignalNativeAvailable()) return;

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
