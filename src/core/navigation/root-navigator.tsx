import React from "react";
import { StyleSheet } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { navigationRef } from "./navigation-ref";
import { useAuthStore } from "@/features/auth/auth.state";
import { isIOS26 } from "@/core/common/utils/platform";
import { FONTS, SPACING } from "@/core/common/constants/theme";
import { useThemeColors, useIsDark } from "@/core/common/hooks/use-theme-colors";

// Auth
import AuthScreen from "@/features/auth/auth.screen";
// Onboarding
import OnboardingGmailScreen from "@/features/onboarding/screens/onboarding-gmail.screen";
import OnboardingConnectScreen from "@/features/onboarding/screens/onboarding-connect.screen";
import OnboardingGoalScreen from "@/features/onboarding/screens/onboarding-goal.screen";
import OnboardingLoadingScreen from "@/features/onboarding/screens/onboarding-loading.screen";
import OnboardingResultsScreen from "@/features/onboarding/screens/onboarding-results.screen";
// Tabs
import HomeScreen from "@/features/home/home.screen";
import TransactionsScreen from "@/features/transactions/screens/transaction-detail.screen";
import BudgetScreen from "@/features/budgets/screens/budget-detail.screen";
import ProfileScreen from "@/features/user/screens/profile.screen";
// Main stack screens
import TransactionDetailScreen from "@/features/transactions/screens/transaction-detail.screen";
import CorrectTransactionScreen from "@/features/transactions/screens/correct-transaction.screen";
import BudgetDetailScreen from "@/features/budgets/screens/budget-detail.screen";
import AddBudgetScreen from "@/features/budgets/screens/add-budget.screen";
import EditBudgetScreen from "@/features/budgets/screens/edit-budget.screen";
import BudgetSuggestionsScreen from "@/features/budgets/screens/budget-suggestions.screen";
import GoalsScreen from "@/features/goals/screens/goals.screen";
import GoalDetailScreen from "@/features/goals/screens/goal-detail.screen";
import AddGoalScreen from "@/features/goals/screens/add-goal.screen";
import EditGoalScreen from "@/features/goals/screens/edit-goal.screen";
import InsightsScreen from "@/features/insights/insights.screen";
import ExchangeRatesScreen from "@/features/exchange-rates/exchange-rates.screen";
import EmailConnectionsScreen from "@/features/email-connection/screens/email-connections.screen";
import ConnectGmailScreen from "@/features/email-connection/screens/connect-gmail.screen";
import GmailLabelPickerScreen from "@/features/email-connection/screens/gmail-label-picker.screen";
import SettingsScreen from "@/features/user/screens/settings.screen";
import PrivacyPolicyScreen from "@/features/user/screens/privacy-policy.screen";
import TermsOfServiceScreen from "@/features/user/screens/terms-of-service.screen";
import NotificationsScreen from "@/features/notifications/screens/notifications.screen";
import NotificationBell from "@/features/notifications/components/notification-bell";

export type RootStackParamList = {
  Tabs: undefined;
  Notifications: undefined;
  TransactionDetail: { transactionId: number };
  CorrectTransaction: { transactionId: number };
  BudgetDetail: { budgetId: number };
  AddBudget: undefined;
  EditBudget: { budgetId: number };
  BudgetSuggestions: undefined;
  Goals: undefined;
  GoalDetail: { goalId: number };
  AddGoal: undefined;
  EditGoal: { goalId: number };
  Insights: undefined;
  CurrencyBreakdown: undefined;
  EmailConnections: undefined;
  ConnectGmail: undefined;
  GmailLabelPicker: { connectionId: number };
  Settings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

export type TabParamList = {
  Home: undefined;
  Transactions: undefined;
  Budget: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const UnauthStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();

const modalOptions = {
  headerShown: false,
  presentation: "transparentModal" as const,
  animation: "slide_from_bottom" as const,
  animationDuration: 50,
};

function Tabs() {
  const colors = useThemeColors();
  const isDark = useIsDark();

  const tabBarBackground = isIOS26
    ? () => (
        <BlurView
          intensity={80}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )
    : undefined;

  const screenOptions = {
    tabBarStyle: isIOS26
      ? {
          position: "absolute" as const,
          borderTopWidth: 0,
          backgroundColor: "transparent",
          elevation: 0,
        }
      : {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
    tabBarBackground,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarLabelStyle: { fontFamily: FONTS.medium, fontSize: 11 },
    headerShown: false,
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerRight: () => <NotificationBell />,
          headerRightContainerStyle: { paddingRight: SPACING.lg },
          headerStyle: isIOS26
            ? undefined
            : { backgroundColor: colors.surface },
          headerShadowVisible: false,
          headerTitle: "",
          ...(isIOS26
            ? { headerTransparent: true, headerBlurEffect: "light" as const }
            : {}),
        }}
      />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function UnauthenticatedStack() {
  return (
    <UnauthStack.Navigator screenOptions={{ headerShown: false }}>
      <UnauthStack.Screen name="Auth" component={AuthScreen} />
    </UnauthStack.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen
        name="OnboardingGmail"
        component={OnboardingGmailScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingConnect"
        component={OnboardingConnectScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingGoal"
        component={OnboardingGoalScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingLoading"
        component={OnboardingLoadingScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingResults"
        component={OnboardingResultsScreen}
      />
    </OnboardingStack.Navigator>
  );
}

function MainStack() {
  const colors = useThemeColors();

  const headerOptions = isIOS26
    ? {
        headerTransparent: true,
        headerBlurEffect: "light" as const,
        headerShadowVisible: false,
      }
    : {
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
      };

  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
      />
      <Stack.Screen
        name="CorrectTransaction"
        component={CorrectTransactionScreen}
        options={modalOptions}
      />
      <Stack.Screen
        name="BudgetDetail"
        component={BudgetDetailScreen}
        options={modalOptions}
      />
      <Stack.Screen
        name="AddBudget"
        component={AddBudgetScreen}
        options={modalOptions}
      />
      <Stack.Screen
        name="EditBudget"
        component={EditBudgetScreen}
        options={modalOptions}
      />
      <Stack.Screen
        name="BudgetSuggestions"
        component={BudgetSuggestionsScreen}
      />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
      <Stack.Screen
        name="AddGoal"
        component={AddGoalScreen}
        options={modalOptions}
      />
      <Stack.Screen
        name="EditGoal"
        component={EditGoalScreen}
        options={modalOptions}
      />
      <Stack.Screen name="Insights" component={InsightsScreen} />
      <Stack.Screen name="CurrencyBreakdown" component={ExchangeRatesScreen} />
      <Stack.Screen
        name="EmailConnections"
        component={EmailConnectionsScreen}
      />
      <Stack.Screen name="ConnectGmail" component={ConnectGmailScreen} />
      <Stack.Screen
        name="GmailLabelPicker"
        component={GmailLabelPickerScreen}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const colors = useThemeColors();
  const isDark = useIsDark();
  const token = useAuthStore((s) => s.token);
  const onboardingComplete = useAuthStore((s) => s.onboardingComplete);

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.primary,
    },
  };

  let ActiveNavigator: React.ComponentType;
  if (token === null) {
    ActiveNavigator = UnauthenticatedStack;
  } else if (!onboardingComplete) {
    ActiveNavigator = OnboardingNavigator;
  } else {
    ActiveNavigator = MainStack;
  }

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <ActiveNavigator />
    </NavigationContainer>
  );
}
