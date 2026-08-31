import React, { useEffect } from "react";
import { Pressable, View, Text, useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
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
import SignInScreen from "@/features/auth/screens/sign-in.screen";
import SignUpScreen from "@/features/auth/screens/sign-up.screen";
// Onboarding
import OnboardingGetStartedScreen from "@/features/onboarding/screens/onboarding-get-started.screen";
import OnboardingGmailScreen from "@/features/onboarding/screens/onboarding-gmail.screen";
import OnboardingImportStatementScreen from "@/features/onboarding/screens/onboarding-import-statement.screen";
import OnboardingConnectScreen from "@/features/onboarding/screens/onboarding-connect.screen";
import OnboardingManualEntryScreen from "@/features/onboarding/screens/onboarding-manual-entry.screen";
import OnboardingGoalScreen from "@/features/onboarding/screens/onboarding-goal.screen";
import OnboardingLoadingScreen from "@/features/onboarding/screens/onboarding-loading.screen";
import OnboardingResultsScreen from "@/features/onboarding/screens/onboarding-results.screen";
// Tabs
import HomeScreen from "@/features/home/home.screen";
import TransactionsScreen from "@/features/transactions/transactions.screen";
import ProfileScreen from "@/features/user/screens/profile.screen";
// Main stack screens
import TransactionDetailScreen from "@/features/transactions/screens/transaction-detail.screen";
import AccountsScreen from "@/features/accounts/screens/accounts.screen";
import CategoryManagementScreen from "@/features/categories/screens/category-management.screen";
import ReviewTransfersScreen from "@/features/transactions/screens/review-transfers.screen";
import CorrectTransactionScreen from "@/features/transactions/screens/correct-transaction.screen";
import BudgetDetailScreen from "@/features/budgets/screens/budget-detail.screen";
import AddBudgetScreen from "@/features/budgets/screens/add-budget.screen";
import EditBudgetScreen from "@/features/budgets/screens/edit-budget.screen";
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
import AddActionSheet from "@/features/add-action/components/add-action-sheet";
import { useAddActionStore } from "@/features/add-action/add-action.state";
import ImportCsvSheet from "@/features/transactions/components/import-csv-sheet";

export type RootStackParamList = {
  Tabs: undefined;
  Notifications: undefined;
  TransactionDetail: { transactionId: number };
  CorrectTransaction: { transactionId: number };
  Accounts: undefined;
  CategoryManagement: undefined;
  ReviewTransfers: undefined;
  BudgetDetail: { budgetId: number };
  AddBudget: undefined;
  EditBudget: { budgetId: number };
  Goals: undefined;
  GoalDetail: { goalId: number };
  AddGoal: undefined;
  EditGoal: { goalId: number };
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
    label: "Insights",
    component: InsightsScreen,
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

// ─── Tab bar bump geometry ──────────────────────────────────────────────────
// The center "+" floats above the bar, nested in a notch cut into the bar's
// top edge. Both the notch curve and the button's vertical offset are
// computed from these constants so they stay visually aligned.
const BAR_HEIGHT = 60;
const BUMP_DEPTH = 10;
const BUMP_HALF_WIDTH = 38;
const ADD_BUTTON_SIZE = 52;
const ADD_BUTTON_GLOW_SIZE = ADD_BUTTON_SIZE + 16;
// Gap between the notch's peak (above) and the button's top edge (below),
// so the notch pokes up visibly over the button instead of being covered.
const ADD_BUTTON_NOTCH_GAP = 3;
// Extra manual nudge downward on top of the gap-preserving position.
const ADD_BUTTON_EXTRA_DROP = 2;
const ADD_BUTTON_CENTER_Y =
  -BUMP_DEPTH + ADD_BUTTON_NOTCH_GAP + ADD_BUTTON_SIZE / 2 + ADD_BUTTON_EXTRA_DROP;

function buildTabBarTopEdgePath(width: number): string {
  const cx = width / 2;
  const leftFlatEnd = cx - BUMP_HALF_WIDTH - 20;
  const rightFlatStart = cx + BUMP_HALF_WIDTH + 20;
  return [
    `M0,${BUMP_DEPTH}`,
    `L${leftFlatEnd},${BUMP_DEPTH}`,
    `C${cx - BUMP_HALF_WIDTH + 8},${BUMP_DEPTH} ${cx - BUMP_HALF_WIDTH + 4},0 ${cx},0`,
    `C${cx + BUMP_HALF_WIDTH - 4},0 ${cx + BUMP_HALF_WIDTH - 8},${BUMP_DEPTH} ${rightFlatStart},${BUMP_DEPTH}`,
    `L${width},${BUMP_DEPTH}`,
  ].join(" ");
}

function buildTabBarFillPath(width: number, totalHeight: number): string {
  return [
    buildTabBarTopEdgePath(width),
    `L${width},${totalHeight}`,
    `L0,${totalHeight}`,
    "Z",
  ].join(" ");
}

function TabsCrossPlatform() {
  const colors = useThemeColors();

  // Custom tab bar to completely control press feedback on iOS and Android.
  // Using a custom bar avoids platform-specific overlays applied by the default bar.
  function MyTabBar({ state, _descriptors, navigation }: any) {
    const openChooser = useAddActionStore((s) => s.openChooser);
    const { width } = useWindowDimensions();

    function renderTab(route: any, index: number) {
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
    }

    // The persistent "+" sits dead-center among the tabs — a UI-only action
    // that opens the add-action chooser sheet, not a navigable route (so it
    // isn't part of state.routes / BottomTab.Screen).
    const mid = Math.ceil(state.routes.length / 2);
    const firstHalf = state.routes.slice(0, mid);
    const secondHalf = state.routes.slice(mid);

    return (
      <SafeAreaView edges={["bottom"]} style={{ backgroundColor: colors.surface }}>
        <View style={{ height: BAR_HEIGHT }}>
          <Svg
            width={width}
            height={BAR_HEIGHT + BUMP_DEPTH}
            style={{ position: "absolute", top: -BUMP_DEPTH, left: 0 }}
          >
            <Path
              d={buildTabBarFillPath(width, BAR_HEIGHT + BUMP_DEPTH)}
              fill={colors.surface}
            />
            <Path
              d={buildTabBarTopEdgePath(width)}
              fill="none"
              stroke={colors.border}
              strokeWidth={1}
            />
          </Svg>

          <View style={{ flexDirection: "row", height: BAR_HEIGHT }}>
            {firstHalf.map((route: any, index: number) => renderTab(route, index))}
            {/* Empty flex cell reserves the layout slot the floating button sits above. */}
            <View style={{ flex: 1 }} />
            {secondHalf.map((route: any, index: number) =>
              renderTab(route, mid + index),
            )}
          </View>

          <View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              left: width / 2 - ADD_BUTTON_GLOW_SIZE / 2,
              top: ADD_BUTTON_CENTER_Y - ADD_BUTTON_GLOW_SIZE / 2,
              width: ADD_BUTTON_GLOW_SIZE,
              height: ADD_BUTTON_GLOW_SIZE,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Glow rings temporarily disabled — re-enable by uncommenting.
            <View
              style={{
                position: "absolute",
                width: ADD_BUTTON_GLOW_SIZE,
                height: ADD_BUTTON_GLOW_SIZE,
                borderRadius: ADD_BUTTON_GLOW_SIZE / 2,
                backgroundColor: colors.primary,
                opacity: 0.16,
              }}
            />
            <View
              style={{
                position: "absolute",
                width: ADD_BUTTON_SIZE + 8,
                height: ADD_BUTTON_SIZE + 8,
                borderRadius: (ADD_BUTTON_SIZE + 8) / 2,
                backgroundColor: colors.primary,
                opacity: 0.28,
              }}
            />
            */}
            <Pressable
              onPress={openChooser}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Add"
              style={{
                width: ADD_BUTTON_SIZE,
                height: ADD_BUTTON_SIZE,
                borderRadius: ADD_BUTTON_SIZE / 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.primary,
              }}
            >
              <Ionicons name="add" size={22} color={colors.onPrimary} />
            </Pressable>
          </View>
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
      <UnauthStack.Screen name="SignIn" component={SignInScreen} />
      <UnauthStack.Screen name="SignUp" component={SignUpScreen} />
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
        name="OnboardingGetStarted"
        component={OnboardingGetStartedScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingGmail"
        component={OnboardingGmailScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingImportStatement"
        component={OnboardingImportStatementScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingConnect"
        component={OnboardingConnectScreen}
      />
      <OnboardingStack.Screen
        name="OnboardingManualEntry"
        component={OnboardingManualEntryScreen}
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
        name="Accounts"
        component={AccountsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryManagement"
        component={CategoryManagementScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewTransfers"
        component={ReviewTransfersScreen}
        options={{ headerShown: false }}
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

  // True whenever the tab bar (and thus the persistent "+" button) is mounted.
  const isMainActive = !!token && onboardingComplete;
  const isImportOpen = useAddActionStore((s) => s.isImportOpen);
  const closeImport = useAddActionStore((s) => s.closeImport);

  return (
    <>
      <NavigationContainer ref={navigationRef} theme={navTheme}>
        <ActiveNavigator />
      </NavigationContainer>
      {/* IrisFAB is temporarily hidden — Iris is now opened via the icon
          button next to the notification bell in HomeHeader. Left mounted
          in code (just not rendered) so it's a one-line change to bring
          back; IrisFAB.tsx itself is untouched. */}
      {false && isMainActive && <IrisFAB />}
      {isMainActive && <IrisChatModal />}
      {isMainActive && <AddActionSheet />}
      {isMainActive && (
        <ImportCsvSheet visible={isImportOpen} onClose={closeImport} />
      )}
    </>
  );
}
