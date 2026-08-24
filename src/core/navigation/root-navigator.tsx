import React, { useEffect } from "react";
import { Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { navigationRef } from "./navigation-ref";
import { useAuthStore } from "@/features/auth/auth.state";
import { isAndroid, isIOS26 } from "@/core/common/utils/platform";
import {
  useThemeColors,
  useIsDark,
} from "@/core/common/hooks/use-theme-colors";

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
import TransactionsScreen from "@/features/transactions/transactions.screen";
import BudgetScreen from "@/features/budgets/budgets.screen";
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
import SettingsScreen from "@/features/user/screens/settings.screen";
import PrivacyPolicyScreen from "@/features/user/screens/privacy-policy.screen";
import TermsOfServiceScreen from "@/features/user/screens/terms-of-service.screen";
import NotificationsScreen from "@/features/notifications/screens/notifications.screen";
import IrisFAB from "@/features/iris/components/IrisFAB";
import IrisChatModal from "@/features/iris/components/IrisChatModal";

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
  Settings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const UnauthStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();

const modalOptions = {
  headerShown: false,
  presentation: "transparentModal" as const,
  animation: "slide_from_bottom" as const,
  animationDuration: 50,
};


// ─── Cross-platform tab bar (Android + older iOS) ─────────────────────────────

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const ANDROID_TABS: {
  name: string;
  label: string;
  component: React.ComponentType<any>;
  icon: IoniconsName;
  iconFocused: IoniconsName;
}[] = [
  {
    name: "Home",
    label: "Home",
    component: HomeScreen,
    icon: "home-outline",
    iconFocused: "home",
  },
  {
    name: "Transactions",
    label: "Transactions",
    component: TransactionsScreen,
    icon: "card-outline",
    iconFocused: "card",
  },
  {
    name: "Budget",
    label: "Budget",
    component: BudgetScreen,
    icon: "pie-chart-outline",
    iconFocused: "pie-chart",
  },
  {
    name: "Profile",
    label: "Profile",
    component: ProfileScreen,
    icon: "person-outline",
    iconFocused: "person",
  },
];

const BottomTab = createBottomTabNavigator();

function TabsCrossPlatform() {
  const colors = useThemeColors();

  // Custom tab bar to completely control press feedback on iOS and Android.
  // Using a custom bar avoids platform-specific overlays applied by the default bar.
  function MyTabBar({ state, _descriptors, navigation }: any) {
    return (
      <SafeAreaView edges={["bottom"]} style={{ backgroundColor: colors.surface }}>
        <View
          style={{
            flexDirection: "row",
            borderTopColor: colors.border,
            borderTopWidth: 1,
            backgroundColor: colors.surface,
            overflow: "hidden",
          }}
        >
          {state.routes.map((route: any, index: number) => {
            const focused = state.index === index;
            const tab = ANDROID_TABS.find((t) => t.name === route.name);
            const iconName = focused ? tab!.iconFocused : tab!.icon;
            const color = focused ? colors.primary : colors.textSubtle;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () =>
              navigation.emit({ type: "tabLongPress", target: route.key });

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                onLongPress={onLongPress}
                android_ripple={null}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 8,
                }}
              >
                <Ionicons name={iconName} size={22} color={color} />
                <Text style={{ marginTop: 4, fontSize: 12, color }}>
                  {tab?.label ?? route.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <BottomTab.Navigator
      screenOptions={() => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          overflow: "hidden",
        },
      })}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      {ANDROID_TABS.map((tab) => (
        <BottomTab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ title: tab.label }}
        />
      ))}
    </BottomTab.Navigator>
  );
}

function Tabs() {
  // Use the custom tab bar on iOS 26 as well to avoid native press flash/ripple visuals.
  return <TabsCrossPlatform />;
}

// ─── Android system nav bar color sync ───────────────────────────────────────

function useAndroidNavBar() {
  const colors = useThemeColors();
  const isDark = useIsDark();

  useEffect(() => {
    if (!isAndroid) return;
    NavigationBar.setBackgroundColorAsync(colors.surface);
    NavigationBar.setButtonStyleAsync(isDark ? "light" : "dark");
  }, [colors.surface, isDark]);
}

function UnauthenticatedStack() {
  return (
    <UnauthStack.Navigator screenOptions={{ headerShown: false }}>
      <UnauthStack.Screen name="Auth" component={AuthScreen} />
      <UnauthStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: true, title: "Privacy Policy" }}
      />
      <UnauthStack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{ headerShown: true, title: "Terms of Service" }}
      />
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
      <Stack.Screen
        name="Insights"
        component={InsightsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="CurrencyBreakdown" component={ExchangeRatesScreen} />
      <Stack.Screen
        name="EmailConnections"
        component={EmailConnectionsScreen}
      />
      <Stack.Screen name="ConnectGmail" component={ConnectGmailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: "Privacy Policy" }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{ title: "Terms of Service" }}
      />
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
  useAndroidNavBar();
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

  const showIris = !!token && onboardingComplete;

  return (
    <>
      <NavigationContainer ref={navigationRef} theme={navTheme}>
        <ActiveNavigator />
      </NavigationContainer>
      {showIris && <IrisFAB />}
      {showIris && <IrisChatModal />}
    </>
  );
}
