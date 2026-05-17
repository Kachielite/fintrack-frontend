import * as AppleAuthentication from "expo-apple-authentication";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import apiClient from "@/core/common/network/api-client";
import { ENV } from "@/core/common/constants/env";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { mapAxiosErrorToAppError } from "@/core/common/error/app-error";
import { AuthResponseDto } from "./auth.dto";
import { AuthSession } from "./auth.interface";
import { mapAuthSessionFromDto } from "./auth.mapper";

export const AuthService = {
  loginApple: async (): Promise<AuthSession> => {
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      if (!available) {
        throw new Error("Apple Sign-In is not available on this device.");
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("Apple Sign-In did not return an identity token.");
      }

      const { data } = await apiClient.post<AuthResponseDto>(
        API_ENDPOINTS.AUTH_APPLE,
        {
          id_token: credential.identityToken,
          ...(credential.fullName?.givenName
            ? { first_name: credential.fullName.givenName }
            : {}),
          ...(credential.fullName?.familyName
            ? { last_name: credential.fullName.familyName }
            : {}),
        },
      );

      return mapAuthSessionFromDto(data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  loginGoogle: async (): Promise<AuthSession> => {
    // webClientId  → EXPO_PUBLIC_WEB_CLIENT_ID  (Web/Android OAuth client — used on both platforms to obtain a server-verifiable idToken)
    // iosClientId  → EXPO_PUBLIC_IOS_CLIENT_ID  (iOS OAuth client — drives the native iOS sign-in sheet; ignored on Android)
    GoogleSignin.configure({
      webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
      iosClientId: ENV.GOOGLE_IOS_CLIENT_ID,
    });

    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      const idToken = result?.data?.idToken;
      if (!idToken) {
        throw mapAxiosErrorToAppError({
          status: 400,
          error: {
            code: 400,
            message:
              "Google did not return an idToken. Check EXPO_PUBLIC_WEB_CLIENT_ID.",
          },
        });
      }

      const { data } = await apiClient.post<AuthResponseDto>(
        API_ENDPOINTS.AUTH_GOOGLE,
        { id_token: idToken },
      );

      return mapAuthSessionFromDto(data);
    } catch (error) {
      if (isErrorWithCode(error)) {
        // Log the raw code so it appears in Metro/DevTools for diagnosis
        console.log("[GoogleSignIn] error code:", error.code, "| message:", error.message);

        const messages: Record<string, string> = {
          [statusCodes.SIGN_IN_CANCELLED]: "Sign-in was cancelled",
          [statusCodes.IN_PROGRESS]: "Sign-in is already in progress",
          [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]:
            "Google Play Services not available or outdated",
          // Code 10 = DEVELOPER_ERROR: SHA-1 not registered in Google Cloud Console
          "10": "Google sign-in configuration error (code 10). Register your app's SHA-1 fingerprint in the Google Cloud Console.",
        };
        const message =
          messages[String(error.code)] ??
          `Google sign-in failed (code ${error.code})`;
        throw mapAxiosErrorToAppError({
          status: 400,
          error: { code: 400, message },
        });
      }
      console.log("[GoogleSignIn] non-code error:", error);
      throw mapAxiosErrorToAppError(error);
    }
  },

  loginDemo: async (email: string, password: string): Promise<AuthSession> => {
    try {
      const { data } = await apiClient.post<AuthResponseDto>(API_ENDPOINTS.AUTH_DEMO, {
        email,
        password,
      });
      return mapAuthSessionFromDto(data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const { data } = await apiClient.post<{ access_token: string }>(
      API_ENDPOINTS.AUTH_REFRESH,
      { refresh_token: refreshToken },
    );
    return { accessToken: data.access_token };
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
  },
};
