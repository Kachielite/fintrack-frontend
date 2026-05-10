# FinTrack — Frontend Specification
*For Claude Code — React Native + Expo (Bare Workflow)*

Read this file in full before writing any code. Every architectural decision, file placement rule, naming convention, and hook pattern defined here is mandatory. Where a pattern is not explicitly redefined below, follow the BillBot `AGENTS.md` as the baseline — this spec only documents what is different or new.

---

## Stack

| Concern | Library |
|---|---|
| Framework | React Native (Expo bare workflow) |
| Navigation | React Navigation v7 — Static API (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`) |
| Server state | `@tanstack/react-query` |
| Client state | `zustand` |
| Forms + validation | `react-hook-form` + `zod` + `@hookform/resolvers` |
| HTTP | `axios` |
| Storage | `@react-native-async-storage/async-storage` |
| Auth | `@react-native-google-signin/google-signin`, `@invertase/react-native-apple-authentication` |
| Blur / glass | `expo-blur` |
| Toast | `toastify-react-native` |
| Date | `date-fns` |
| Typography | Plus Jakarta Sans (loaded via `expo-font`) |

Do not install any package not listed above without explicit approval.

---

## Project Structure

```
fintrack/
  app.json
  babel.config.js
  index.ts
  package.json
  tsconfig.json
  android/
  ios/
  assets/
  src/
    App.tsx
    core/
      assets/
      common/
        components/
        constants/
        error/
        hooks/
        interface/
        network/
        state/
        utils/
      navigation/
        index.ts
        navigation-ref.ts
        root-navigator.tsx
    features/
      auth/
        components/
        hooks/
        auth.dto.ts
        auth.interface.ts
        auth.mapper.ts
        auth.screen.tsx
        auth.service.ts
        auth.state.ts
      onboarding/
        components/
        hooks/
        screens/
          onboarding-gmail.screen.tsx
          onboarding-goal.screen.tsx
        onboarding.dto.ts
        onboarding.interface.ts
        onboarding.mapper.ts
        onboarding.service.ts
      home/
        components/
        home.screen.tsx
      transactions/
        components/
        hooks/
        screens/
          transaction-detail.screen.tsx
          correct-transaction.screen.tsx
        transactions.dto.ts
        transactions.interface.ts
        transactions.mapper.ts
        transactions.service.ts
        transactions.state.ts
      budgets/
        components/
        hooks/
        screens/
          budget-detail.screen.tsx
          add-budget.screen.tsx
          edit-budget.screen.tsx
          budget-suggestions.screen.tsx
        budgets.dto.ts
        budgets.interface.ts
        budgets.mapper.ts
        budgets.service.ts
        budgets.state.ts
      goals/
        components/
        hooks/
        screens/
          goals.screen.tsx
          goal-detail.screen.tsx
          add-goal.screen.tsx
          edit-goal.screen.tsx
        goals.dto.ts
        goals.interface.ts
        goals.mapper.ts
        goals.service.ts
      insights/
        components/
        hooks/
        insights.screen.tsx
        insights.dto.ts
        insights.interface.ts
        insights.mapper.ts
        insights.service.ts
        insights.state.ts
      exchange-rates/
        components/
        hooks/
        exchange-rates.screen.tsx
        exchange-rates.dto.ts
        exchange-rates.interface.ts
        exchange-rates.mapper.ts
        exchange-rates.service.ts
      email-connection/
        components/
        hooks/
        screens/
          email-connections.screen.tsx
          connect-gmail.screen.tsx
          gmail-label-picker.screen.tsx
        email-connection.dto.ts
        email-connection.interface.ts
        email-connection.mapper.ts
        email-connection.service.ts
        email-connection.state.ts
      user/
        components/
        hooks/
        screens/
          profile.screen.tsx
          settings.screen.tsx
          privacy-policy.screen.tsx
          terms-of-service.screen.tsx
        user.dto.ts
        user.interface.ts
        user.mapper.ts
        user.service.ts
        user.state.ts
```

---

## Design System

### Design Reference

All visual decisions — colors, spacing, border radii, typography scale, card styles, icon styles, and component variants — are defined in the Claude Design output (`Fintrack.zip`). Extract design tokens from the design files and map them to the constants below. Do not invent values; use what the designs specify.

### `src/core/common/constants/theme.ts`

```typescript
export const COLORS = {
  // Extract all values from the Fintrack design tokens file
  primary: '',           // warm olive / sage — the brand primary
  primaryLight: '',      // tinted primary for backgrounds
  accent: '',            // amber — used for highlights and CTAs
  accentLight: '',
  background: '',        // warm cream — main app background
  surface: '',           // card surfaces (white or near-white)
  surfaceElevated: '',   // elevated cards (modals, bottom sheets)
  border: '',
  textPrimary: '',       // dark — main body text
  textSecondary: '',     // muted — labels, metadata
  textInverse: '',       // white — text on dark backgrounds
  success: '',           // healthy budget state
  warning: '',           // amber — approaching limit
  error: '',             // soft red — over limit (never harsh)
  // Category colors — one per CategoryEnum value
  categoryFood: '',
  categoryTransit: '',
  categoryUtility: '',
  categorySubs: '',
  categoryTransfer: '',
  categoryFun: '',
  categoryHealth: '',
  categoryOther: '',
} as const;

export const FONTS = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  // Monospace for transaction amounts and account numbers
  mono: 'SpaceMono_400Regular',   // or any monospace available via expo-font
} as const;

export const FONT_SIZE = {
  display: 40,     // large balance figures
  h1: 28,
  h2: 22,
  h3: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
```

### `src/core/common/constants/env.ts`

```typescript
export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.fintrack.app/api',
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  APPLE_BUNDLE_ID: process.env.EXPO_PUBLIC_APPLE_BUNDLE_ID ?? 'app.fintrack',
} as const;
```

### `src/core/common/constants/storage-keys.ts`

```typescript
export const STORAGE_KEYS = {
  SESSION_TOKEN: '@fintrack/session_token',
  REFRESH_TOKEN: '@fintrack/refresh_token',
  USER_PROFILE: '@fintrack/user_profile',
  COLOR_SCHEME: '@fintrack/color_scheme',
} as const;
```

### `src/core/common/constants/query-keys.ts`

```typescript
export const QUERY_KEYS = {
  ME: 'me',
  BANKS: 'banks',
  TRANSACTIONS: 'transactions',
  TRANSACTION_DETAIL: 'transaction-detail',
  TRANSACTION_SUMMARY: 'transaction-summary',
  UNVERIFIED_TRANSACTIONS: 'unverified-transactions',
  BUDGETS: 'budgets',
  BUDGET_DETAIL: 'budget-detail',
  BUDGET_SUGGESTIONS: 'budget-suggestions',
  GOALS: 'goals',
  GOAL_DETAIL: 'goal-detail',
  INSIGHTS: 'insights',
  EXCHANGE_RATES: 'exchange-rates',
  EMAIL_CONNECTIONS: 'email-connections',
  EMAIL_CONNECTION_DETAIL: 'email-connection-detail',
  GMAIL_LABELS: 'gmail-labels',
  GMAIL_AUTH_URL: 'gmail-auth-url',
} as const;
```

### `src/core/common/network/api-endpoints.ts`

```typescript
export const API_ENDPOINTS = {
  // Auth
  AUTH_GOOGLE: '/auth/google',
  AUTH_APPLE: '/auth/apple',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',

  // Users
  USERS_ME: '/users/me',
  USERS_ME_ONBOARDING: '/users/me/onboarding',

  // Banks
  BANKS: '/banks',
  BANK_DETAIL: (id: number) => `/banks/${id}`,

  // Email connections
  EMAIL_CONNECTIONS: '/email-connections',
  EMAIL_CONNECTION_DETAIL: (id: number) => `/email-connections/${id}`,
  EMAIL_CONNECTION_LABELS: (id: number) => `/email-connections/${id}/labels`,
  EMAIL_CONNECTION_LABEL: (id: number) => `/email-connections/${id}/label`,
  EMAIL_CONNECTION_SYNC: (id: number) => `/email-connections/${id}/sync`,
  GMAIL_AUTH_URL: '/email-connections/google/auth-url',
  GMAIL_CALLBACK: '/email-connections/google/callback',

  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAIL: (id: number) => `/transactions/${id}`,
  TRANSACTIONS_SUMMARY: '/transactions/summary',
  TRANSACTIONS_UNVERIFIED: '/transactions/unverified',

  // Exchange rates
  EXCHANGE_RATES: '/exchange-rates',

  // Budgets
  BUDGETS: '/budgets',
  BUDGET_DETAIL: (id: number) => `/budgets/${id}`,
  BUDGET_CATEGORY_DETAIL: (id: number) => `/budgets/${id}/detail`,
  BUDGET_SUGGESTIONS: '/budgets/suggestions',

  // Goals
  GOALS: '/goals',
  GOAL_DETAIL: (id: number) => `/goals/${id}`,

  // Insights
  INSIGHTS: '/insights',
  INSIGHT_READ: (id: number) => `/insights/${id}/read`,
} as const;
```

---

## iOS 26 Liquid Glass & Android Fallback

### Platform Detection Utility

Create `src/core/common/utils/platform.ts`:

```typescript
import { Platform } from 'react-native';

// True only on iOS 26+
export const isIOS26 = Platform.OS === 'ios' && parseInt(Platform.Version as string, 10) >= 26;
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
```

### Usage Pattern

For every component that uses liquid glass or iOS 26 native styling:

```typescript
import { isIOS26 } from '@/core/common/utils/platform';
import { BlurView } from 'expo-blur';

// iOS 26: use BlurView with tint for glass effect
// iOS < 26 and Android: use solid surface color
const CardBackground = isIOS26
  ? <BlurView intensity={60} tint="light" style={styles.card} />
  : <View style={[styles.card, { backgroundColor: COLORS.surface }]} />;
```

### Bottom Tab Bar

The tab bar uses **liquid glass styling on iOS 26** via React Navigation's built-in `tabBarStyle` blur support. On Android and older iOS, it falls back to a solid surface color with a top border.

In `root-navigator.tsx`, configure the bottom tab navigator:

```typescript
import { isIOS26 } from '@/core/common/utils/platform';
import { BlurView } from 'expo-blur';

const tabBarBackground = isIOS26
  ? () => <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
  : undefined;

const bottomTabScreenOptions = {
  tabBarStyle: isIOS26
    ? { position: 'absolute', borderTopWidth: 0, backgroundColor: 'transparent', elevation: 0 }
    : { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, borderTopWidth: StyleSheet.hairlineWidth },
  tabBarBackground,
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: COLORS.textSecondary,
  tabBarLabelStyle: { fontFamily: FONTS.medium, fontSize: 11 },
};
```

When `isIOS26` is true and the tab bar is positioned absolutely, all tab screens must add `paddingBottom` equal to the tab bar height to their scroll view / safe area. Use `useSafeAreaInsets().bottom + 60` as the bottom inset value.

### Screen Headers

On iOS 26, prefer `headerTransparent: true` with a `BlurView` header background. On Android, use solid `COLORS.surface` header.

```typescript
const headerOptions = isIOS26
  ? {
      headerTransparent: true,
      headerBlurEffect: 'light',
      headerShadowVisible: false,
    }
  : {
      headerStyle: { backgroundColor: COLORS.surface },
      headerShadowVisible: false,
    };
```

---

## Auth Gating Logic

`root-navigator.tsx` reads from `useAuthStore`:

```typescript
const token = useAuthStore((s) => s.token);
const onboardingComplete = useAuthStore((s) => s.onboardingComplete);
```

- `token === null` → render `UnauthenticatedStack`
- `token !== null && !onboardingComplete` → render `OnboardingStack`
- `token !== null && onboardingComplete` → render `MainStack` (tabs + modal screens)

`onboardingComplete` is derived from the user profile's `onboarding_complete` field. It must be persisted to `AsyncStorage` alongside the token so the correct stack renders on cold start before the profile fetch resolves.

---

## Navigation Architecture

### Navigator Hierarchy

```
Navigation (component)
├── UnauthenticatedStack (NativeStack)
│   └── Auth → AuthScreen
├── OnboardingStack (NativeStack)
│   ├── OnboardingGmail → OnboardingGmailScreen
│   └── OnboardingGoal → OnboardingGoalScreen
└── MainStack (NativeStack)
    ├── Tabs (BottomTab)
    │   ├── Home → HomeScreen
    │   ├── Transactions → TransactionsScreen
    │   ├── Budget → BudgetScreen
    │   └── Profile → ProfileScreen
    ├── TransactionDetail → TransactionDetailScreen       params: { transactionId: number }
    ├── CorrectTransaction → CorrectTransactionScreen     params: { transactionId: number }
    │                                                     presentation: transparentModal
    ├── BudgetDetail → BudgetDetailScreen                 params: { budgetId: number }
    │                                                     presentation: transparentModal
    ├── AddBudget → AddBudgetScreen                       presentation: transparentModal
    ├── EditBudget → EditBudgetScreen                     params: { budgetId: number }
    │                                                     presentation: transparentModal
    ├── BudgetSuggestions → BudgetSuggestionsScreen
    ├── Goals → GoalsScreen
    ├── GoalDetail → GoalDetailScreen                     params: { goalId: number }
    ├── AddGoal → AddGoalScreen                           presentation: transparentModal
    ├── EditGoal → EditGoalScreen                         params: { goalId: number }
    │                                                     presentation: transparentModal
    ├── Insights → InsightsScreen
    ├── CurrencyBreakdown → CurrencyBreakdownScreen
    ├── EmailConnections → EmailConnectionsScreen
    ├── ConnectGmail → ConnectGmailScreen
    ├── GmailLabelPicker → GmailLabelPickerScreen         params: { connectionId: number }
    ├── Settings → SettingsScreen
    ├── PrivacyPolicy → PrivacyPolicyScreen
    └── TermsOfService → TermsOfServiceScreen
```

### Modal Presentation Options

All `transparentModal` screens use:

```typescript
{
  headerShown: false,
  presentation: 'transparentModal',
  animation: 'slide_from_bottom',
  animationDuration: 50,
}
```

---

## Feature Reference

### Feature: `auth`

**Zod schemas (`auth.dto.ts`)**
- `googleSignInSchema` — `{ id_token: string }`
- `appleSignInSchema` — `{ id_token: string; first_name?: string; last_name?: string }`

**Response DTOs**
```typescript
export interface AuthUserDto {
  id: number;
  email: string;
  first_name: string;
  onboarding_complete: boolean;
}
export interface AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: AuthUserDto;
}
```

**Domain interfaces (`auth.interface.ts`)**
- `AuthUser { id: number; email: string; firstName: string; onboardingComplete: boolean }`
- `AuthSession { accessToken: string; refreshToken: string; user: AuthUser }`

**Mappers** — `mapAuthUserFromDto`, `mapAuthSessionFromDto`

**Service (`auth.service.ts`)**
- `signInWithGoogle(idToken: string): Promise<AuthSession>` → POST `/auth/google`
- `signInWithApple(payload): Promise<AuthSession>` → POST `/auth/apple`
- `refreshToken(refreshToken: string): Promise<{ accessToken: string }>` → POST `/auth/refresh`
- `logout(): Promise<void>` → POST `/auth/logout` then clear both tokens from storage

**Zustand store (`auth.state.ts`)**
```typescript
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  onboardingComplete: boolean;
  isLoading: boolean;
  setSession(session: AuthSession): void;
  clearSession(): void;
  setOnboardingComplete(): void;
  initSession(): Promise<void>; // reads tokens from storage, validates, populates user
}
```

**Hooks**
- `use-google-sign-in.ts` — `useMutation` only → calls `GoogleSignin.signIn()`, extracts `idToken`, calls `AuthService.signInWithGoogle`, stores session → `{ signIn, isLoading }`
- `use-apple-sign-in.ts` — `useMutation` only → calls `appleAuth.performRequest()`, extracts `identityToken`, calls `AuthService.signInWithApple`, stores session → `{ signIn, isLoading }`

---

### Feature: `onboarding`

Two-step flow, each step is a separate screen. The onboarding stack only renders when `token !== null && !onboardingComplete`.

**Zod schemas (`onboarding.dto.ts`)**
- `completeOnboardingSchema` — `{ goal_type: GoalTypeEnum, income_range: string, pay_frequency: PayFrequencyEnum, ref_currency: CurrencyEnum }`
  - `goal_type`: enum `'save' | 'debt' | 'daily' | 'specific'`
  - `pay_frequency`: enum `'weekly' | 'biweekly' | 'monthly' | 'irregular'`
  - `ref_currency`: enum of supported currencies
  - `income_range`: `z.string().min(1)`

**Response DTOs**
```typescript
export interface OnboardingResponseDto extends UserProfileDto {}
```

**Service (`onboarding.service.ts`)**
- `completeOnboarding(data: CompleteOnboardingSchemaType): Promise<UserProfile>` → POST `/users/me/onboarding`

**Hooks**
- `use-complete-onboarding.ts` — `useForm<CompleteOnboardingSchemaType>` + `useMutation`; on success calls `authStore.setOnboardingComplete()` → `{ form, isSubmitting, completeOnboarding }`

**Screens**

`OnboardingGmailScreen` — Step 1. Explains the Gmail label setup. No form fields. Shows an illustrated walkthrough of three micro-steps: create label → set filter → confirm. Has a "I've done this" primary CTA that navigates to `OnboardingGoal` and a "Show me how" secondary link. Adapts illustrations from the Fintrack design files.

`OnboardingGoalScreen` — Step 2. Conversational layout — not a form. Uses selector cards for goal type (4 options from `GoalTypeEnum`), a stepped slider or segmented picker for income range, and a segmented control for pay frequency. The submit CTA calls `useCompleteOnboarding`. On success the navigator switches to `MainStack` automatically via auth state change.

---

### Feature: `user`

**Zod schemas (`user.dto.ts`)**
- `updateUserSchema` — `{ first_name?: string; last_name?: string; ref_currency?: CurrencyEnum; advisor_tone?: AdvisorToneEnum }`

**Response DTOs**
```typescript
export interface UserProfileDto {
  id: number;
  email: string;
  first_name: string;
  last_name: string | null;
  ref_currency: string;
  advisor_tone: string;
  goal_type: string | null;
  income_range: string | null;
  pay_frequency: string | null;
  onboarding_complete: boolean;
  plan_tier: string;
  created_at: string;
}
```

**Domain interfaces (`user.interface.ts`)**
```typescript
export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  refCurrency: string;
  advisorTone: string;
  goalType: string | null;
  incomeRange: string | null;
  payFrequency: string | null;
  onboardingComplete: boolean;
  planTier: string;
  createdAt: Date;
}
```

**Service (`user.service.ts`)**
- `getProfile(): Promise<UserProfile>` → GET `/users/me`
- `updateProfile(data: UpdateUserSchemaType): Promise<UserProfile>` → PATCH `/users/me`
- `deleteAccount(): Promise<void>` → DELETE `/users/me`

**Zustand store (`user.state.ts`)** — `profile: UserProfile | null`, actions: `setProfile`, `clearProfile`, `updateProfile`

**Hooks**
- `use-profile.ts` — `useQuery([QUERY_KEYS.ME])` → `{ profile, isLoading, error, refetch }`
- `use-update-profile.ts` — `useForm<UpdateUserSchemaType>` + `useMutation`, invalidates `ME` → `{ form, isUpdating, updateProfile }`
- `use-delete-account.ts` — `useMutation` only; on success calls `authStore.clearSession()` → `{ deleteAccount, isDeleting }`

---

### Feature: `transactions`

**Zod schemas (`transactions.dto.ts`)**
- `correctTransactionSchema` — `{ merchant?: string; category?: CategoryEnum; transaction_type?: TransactionTypeEnum; amount?: number }`

**Response DTOs**
```typescript
export interface TransactionDto {
  id: number;
  merchant: string;
  category: string;
  transaction_type: string;
  amount: number;
  currency: string;
  ref_amount: number;
  ref_currency: string;
  exchange_rate_used: number | null;
  transaction_date: string;
  status: string;
  bank_id: number | null;
  reference: string | null;
  balance: number | null;
  original_merchant: string | null;
  original_category: string | null;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  currency?: string;
  bank_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface TransactionSummaryDto {
  period_start: string;
  period_end: string;
  total_spend: number;
  total_income: number;
  net: number;
  ref_currency: string;
  by_category: { category: string; total: number; count: number; percentage: number }[];
  by_currency: { currency: string; spend: number; income: number; net: number }[];
  vs_last_period_pct: number | null;
}
```

**Domain interfaces (`transactions.interface.ts`)**
```typescript
export type TransactionStatus = 'verified' | 'unverified' | 'review' | 'corrected';
export type TransactionType = 'debit' | 'credit';
export type CategoryType = 'food' | 'transit' | 'utility' | 'subs' | 'transfer' | 'fun' | 'health' | 'other';

export interface Transaction {
  id: number;
  merchant: string;
  category: CategoryType;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  refAmount: number;
  refCurrency: string;
  exchangeRateUsed: number | null;
  transactionDate: Date;
  status: TransactionStatus;
  bankId: number | null;
  reference: string | null;
  balance: number | null;
  originalMerchant: string | null;
  originalCategory: string | null;
}

export interface TransactionSummary {
  periodStart: Date;
  periodEnd: Date;
  totalSpend: number;
  totalIncome: number;
  net: number;
  refCurrency: string;
  byCategory: { category: string; total: number; count: number; percentage: number }[];
  byCurrency: { currency: string; spend: number; income: number; net: number }[];
  vsLastPeriodPct: number | null;
}
```

**Service (`transactions.service.ts`)**
- `listTransactions(params?: TransactionQueryParams): Promise<PaginatedResponse<Transaction>>` → GET `/transactions`
- `getTransaction(id: number): Promise<Transaction>` → GET `/transactions/:id`
- `getSummary(year?: number, month?: number): Promise<TransactionSummary>` → GET `/transactions/summary`
- `getUnverified(): Promise<Transaction[]>` → GET `/transactions/unverified`
- `correctTransaction(id: number, data: CorrectTransactionSchemaType): Promise<Transaction>` → PATCH `/transactions/:id`

**Hooks**
- `use-transactions.ts` — `useQuery([QUERY_KEYS.TRANSACTIONS, params])` paginated → `{ transactions, isLoading, error, refetch }`
- `use-transaction-detail.ts` — `useQuery([QUERY_KEYS.TRANSACTION_DETAIL, id])` → `{ transaction, isLoading, error }`
- `use-transaction-summary.ts` — `useQuery([QUERY_KEYS.TRANSACTION_SUMMARY, year, month])` → `{ summary, isLoading, error }`
- `use-unverified-transactions.ts` — `useQuery([QUERY_KEYS.UNVERIFIED_TRANSACTIONS])` → `{ transactions, count, isLoading }`
- `use-correct-transaction.ts` — `useForm<CorrectTransactionSchemaType>` + `useMutation`, invalidates `TRANSACTIONS` and `TRANSACTION_DETAIL` → `{ form, isCorrectingTransaction, correctTransaction }`

---

### Feature: `budgets`

**Zod schemas (`budgets.dto.ts`)**
- `createBudgetSchema` — `{ category: CategoryEnum; limit_amount: z.number().positive(); currency: string; period_type: 'monthly' | 'weekly' }`
- `updateBudgetSchema` — `{ limit_amount?: number; period_type?: 'monthly' | 'weekly'; is_active?: boolean }`

**Response DTOs**
```typescript
export interface BudgetDto {
  id: number;
  category: string;
  limit_amount: number;
  currency: string;
  period_type: string;
  is_suggested_by_ai: boolean;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'healthy' | 'warning' | 'over';
  days_remaining: number;
}

export interface BudgetDetailDto extends BudgetDto {
  transaction_count: number;
  merchant_breakdown: {
    merchant: string;
    total: number;
    percentage_of_budget: number;
    transaction_count: number;
  }[];
  transactions: {
    date_group: string;
    items: {
      id: number;
      merchant: string;
      bank: string;
      amount: number;
      currency: string;
      ref_amount: number;
      time: string;
      status: string;
    }[];
  }[];
}

export interface BudgetSuggestionDto {
  category: string;
  suggested_limit: number;
  message: string;
}
```

**Domain interfaces (`budgets.interface.ts`)**
```typescript
export type BudgetStatus = 'healthy' | 'warning' | 'over';

export interface Budget {
  id: number;
  category: CategoryType;
  limitAmount: number;
  currency: string;
  periodType: 'monthly' | 'weekly';
  isSuggestedByAi: boolean;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
  daysRemaining: number;
}

export interface BudgetDetail extends Budget {
  transactionCount: number;
  merchantBreakdown: { merchant: string; total: number; percentageOfBudget: number; transactionCount: number }[];
  transactions: { dateGroup: string; items: BudgetTransactionItem[] }[];
}

export interface BudgetTransactionItem {
  id: number;
  merchant: string;
  bank: string;
  amount: number;
  currency: string;
  refAmount: number;
  time: string;
  status: string;
}

export interface BudgetSuggestion {
  category: CategoryType;
  suggestedLimit: number;
  message: string;
}
```

**Service (`budgets.service.ts`)**
- `listBudgets(): Promise<Budget[]>` → GET `/budgets`
- `getBudgetDetail(id: number): Promise<BudgetDetail>` → GET `/budgets/:id/detail`
- `createBudget(data: CreateBudgetSchemaType): Promise<Budget>` → POST `/budgets`
- `updateBudget(id: number, data: UpdateBudgetSchemaType): Promise<Budget>` → PATCH `/budgets/:id`
- `deleteBudget(id: number): Promise<void>` → DELETE `/budgets/:id`
- `getSuggestions(): Promise<BudgetSuggestion[]>` → GET `/budgets/suggestions`

**Zustand store (`budgets.state.ts`)** — `budgets: Budget[]`, actions: `setBudgets`, `addBudget`, `updateBudget`, `removeBudget`

**Hooks**
- `use-budgets.ts` — `useQuery([QUERY_KEYS.BUDGETS])` → `{ budgets, isLoading, error, refetch }`
- `use-budget-detail.ts` — `useQuery([QUERY_KEYS.BUDGET_DETAIL, id])` → `{ budget, isLoading, error, refetch }`
- `use-budget-suggestions.ts` — `useQuery([QUERY_KEYS.BUDGET_SUGGESTIONS])` → `{ suggestions, isLoading, error }`
- `use-create-budget.ts` — `useForm<CreateBudgetSchemaType>` + `useMutation`, invalidates `BUDGETS` → `{ form, isCreating, createBudget }`
- `use-update-budget.ts` — `useForm<UpdateBudgetSchemaType>` + `useMutation`, invalidates `BUDGETS` and `BUDGET_DETAIL` → `{ form, isUpdating, updateBudget }`
- `use-delete-budget.ts` — `useMutation` only, invalidates `BUDGETS` → `{ deleteBudget, isDeleting }`

---

### Feature: `goals`

**Zod schemas (`goals.dto.ts`)**
- `createGoalSchema` — `{ name: z.string().min(1); type: GoalTypeEnum; target_amount?: z.number().positive(); currency: string; target_date?: z.string().datetime() }`
- `updateGoalSchema` — `{ name?: string; target_amount?: number; saved_amount?: number; target_date?: string }`

**Response DTOs**
```typescript
export interface GoalDto {
  id: number;
  name: string;
  type: string;
  targetAmount: number | null;
  savedAmount: number;
  currency: string;
  targetDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Domain interfaces (`goals.interface.ts`)**
```typescript
export interface Goal {
  id: number;
  name: string;
  type: string;
  targetAmount: number | null;
  savedAmount: number;
  currency: string;
  targetDate: Date | null;
  isActive: boolean;
  progressPct: number | null;  // computed: savedAmount / targetAmount * 100
  createdAt: Date;
  updatedAt: Date;
}
```

**Service (`goals.service.ts`)**
- `listGoals(): Promise<Goal[]>` → GET `/goals`
- `getGoal(id: number): Promise<Goal>` → GET `/goals/:id`
- `createGoal(data: CreateGoalSchemaType): Promise<Goal>` → POST `/goals`
- `updateGoal(id: number, data: UpdateGoalSchemaType): Promise<Goal>` → PATCH `/goals/:id`
- `deleteGoal(id: number): Promise<void>` → DELETE `/goals/:id`

**Hooks**
- `use-goals.ts` — `useQuery([QUERY_KEYS.GOALS])` → `{ goals, isLoading, error, refetch }`
- `use-goal-detail.ts` — `useQuery([QUERY_KEYS.GOAL_DETAIL, id])` → `{ goal, isLoading, error }`
- `use-create-goal.ts` — `useForm<CreateGoalSchemaType>` + `useMutation`, invalidates `GOALS` → `{ form, isCreating, createGoal }`
- `use-update-goal.ts` — `useForm<UpdateGoalSchemaType>` + `useMutation`, invalidates `GOALS` and `GOAL_DETAIL` → `{ form, isUpdating, updateGoal }`
- `use-delete-goal.ts` — `useMutation` only → `{ deleteGoal, isDeleting }`

---

### Feature: `insights`

No Zod schemas — no user-input request bodies (read + mark-read only).

**Response DTOs**
```typescript
export interface InsightDto {
  id: number;
  type: string;
  message: string;
  contextData: Record<string, unknown> | null;
  isRead: boolean;
  expiresAt: string | null;
  createdAt: string;
}
```

**Domain interfaces (`insights.interface.ts`)**
```typescript
export type InsightType =
  | 'spending_pattern'
  | 'budget_warning'
  | 'goal_progress'
  | 'fx_impact'
  | 'subscription_alert'
  | 'positive_reinforcement';

export interface Insight {
  id: number;
  type: InsightType;
  message: string;
  contextData: Record<string, unknown> | null;
  isRead: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}
```

**Service (`insights.service.ts`)**
- `listInsights(unreadOnly?: boolean): Promise<Insight[]>` → GET `/insights?unread_only=`
- `markRead(id: number): Promise<Insight>` → PATCH `/insights/:id/read`

**Zustand store (`insights.state.ts`)** — `unreadCount: number`, actions: `setUnreadCount`, `decrementUnread`, `clearUnread`

**Hooks**
- `use-insights.ts` — `useQuery([QUERY_KEYS.INSIGHTS])` → `{ insights, unreadCount, isLoading, error, refetch }`
- `use-mark-insight-read.ts` — `useMutation` only; on success decrements `insights.state.unreadCount` and invalidates `INSIGHTS` → `{ markRead, isMarking }`

---

### Feature: `exchange-rates`

No Zod schemas — read-only.

**Response DTOs**
```typescript
export interface ExchangeRateDto {
  base_currency: string;
  target_currency: string;
  rate: number;
  fetched_at: string;
}
```

**Domain interfaces (`exchange-rates.interface.ts`)**
```typescript
export interface ExchangeRate {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  fetchedAt: Date;
}
```

**Service (`exchange-rates.service.ts`)**
- `getRates(): Promise<ExchangeRate[]>` → GET `/exchange-rates`

**Hooks**
- `use-exchange-rates.ts` — `useQuery([QUERY_KEYS.EXCHANGE_RATES])` → `{ rates, isLoading, error, refetch }`

---

### Feature: `email-connection`

**Zod schemas (`email-connection.dto.ts`)**
- `setLabelSchema` — `{ label_id: z.string().min(1); label_name: z.string().min(1) }`

**Response DTOs**
```typescript
export interface EmailConnectionDto {
  id: number;
  gmail_address: string;
  status: string;
  gmail_label_id: string | null;
  gmail_label_name: string | null;
  last_synced_at: string | null;
  created_at: string;
}

export interface GmailLabelDto {
  id: string;
  name: string;
  messages_total?: number;
}

export interface GmailAuthUrlDto {
  url: string;
}
```

**Domain interfaces (`email-connection.interface.ts`)**
```typescript
export type ConnectionStatus = 'active' | 'expired' | 'revoked';

export interface EmailConnection {
  id: number;
  gmailAddress: string;
  status: ConnectionStatus;
  gmailLabelId: string | null;
  gmailLabelName: string | null;
  lastSyncedAt: Date | null;
  createdAt: Date;
}

export interface GmailLabel {
  id: string;
  name: string;
  messagesTotal?: number;
}
```

**Service (`email-connection.service.ts`)**
- `getAuthUrl(): Promise<string>` → GET `/email-connections/google/auth-url` → returns `url`
- `handleCallback(code: string, redirectUri: string): Promise<EmailConnection>` → POST `/email-connections/google/callback`
- `listConnections(): Promise<EmailConnection[]>` → GET `/email-connections`
- `getConnection(id: number): Promise<EmailConnection>` → GET `/email-connections/:id`
- `listLabels(connectionId: number): Promise<GmailLabel[]>` → GET `/email-connections/:id/labels`
- `setLabel(connectionId: number, data: SetLabelSchemaType): Promise<EmailConnection>` → PATCH `/email-connections/:id/label`
- `triggerSync(connectionId: number): Promise<void>` → POST `/email-connections/:id/sync`
- `deleteConnection(id: number): Promise<void>` → DELETE `/email-connections/:id`

**Zustand store (`email-connection.state.ts`)** — `connections: EmailConnection[]`, actions: `setConnections`, `addConnection`, `updateConnection`, `removeConnection`

**Hooks**
- `use-email-connections.ts` — `useQuery([QUERY_KEYS.EMAIL_CONNECTIONS])` → `{ connections, isLoading, error, refetch }`
- `use-gmail-labels.ts` — `useQuery([QUERY_KEYS.GMAIL_LABELS, connectionId])` enabled only when `connectionId` is defined → `{ labels, isLoading, error }`
- `use-set-label.ts` — `useForm<SetLabelSchemaType>` + `useMutation`, invalidates `EMAIL_CONNECTIONS` → `{ form, isSettingLabel, setLabel }`
- `use-trigger-sync.ts` — `useMutation` only → `{ triggerSync, isSyncing }`
- `use-delete-connection.ts` — `useMutation` only → `{ deleteConnection, isDeleting }`

---

## Shared Utilities

### `src/core/common/utils/currency.ts`

```typescript
// Formats with correct symbol for each currency
// NGN → ₦, USD → $, GBP → £, KES → KSh, EUR → €, GHS → GH₵, ZAR → R
export function formatCurrency(amount: number, currency: string): string

// Returns just the symbol
export function currencySymbol(currency: string): string

// Formats for transaction rows — negative = debit (show minus), positive = credit
export function formatTransactionAmount(amount: number, currency: string): string
```

### `src/core/common/utils/date.ts`

```typescript
export function formatDate(date: string | Date): string        // 'May 10, 2026'
export function formatRelative(date: string | Date): string    // '2 hours ago'
export function formatShort(date: string | Date): string       // '10 May'
export function formatTime(date: string | Date): string        // '14:32'
export function isToday(date: string | Date): boolean
export function isYesterday(date: string | Date): boolean
export function dateGroupLabel(date: string | Date): string    // 'TODAY' | 'YESTERDAY' | '10 May'
```

### `src/core/common/utils/budget.ts`

```typescript
// Returns COLORS.success | COLORS.warning | COLORS.error based on BudgetStatus
export function budgetStatusColor(status: 'healthy' | 'warning' | 'over'): string

// Returns the icon name or emoji for a CategoryType
export function categoryIcon(category: string): string

// Returns the color defined in COLORS for a CategoryType
export function categoryColor(category: string): string
```

---

## Shared Components

All shared components live in `src/core/common/components/`. Claude Code scaffolds the component file with typed props interface and an empty return — Derrick implements the visual output.

| Component | Props | Notes |
|---|---|---|
| `ScreenContainer` | `children, scrollable?, padding?` | Wraps SafeAreaView + optional ScrollView. Adds bottom padding for glass tab bar on iOS 26. |
| `GlassCard` | `children, style?` | BlurView on iOS 26, solid surface card on Android |
| `TransactionRow` | `transaction: Transaction; onPress?` | Shows category icon, merchant, bank tag, amount in original + ref currency |
| `BudgetProgressBar` | `percentage: number; status: BudgetStatus` | Green/amber/soft-red fill. Never harsh. |
| `CategoryBadge` | `category: CategoryType` | Pill with icon and label |
| `CurrencyTag` | `currency: string` | Small pill — e.g. "NGN", "USD" |
| `AdvisorCard` | `message: string; type?: InsightType` | The warm insight card. Warm styling, never alarming. |
| `StatusDot` | `status: TransactionStatus` | Colour-coded dot for verified/unverified/review/corrected |
| `SectionHeader` | `title: string; action?: { label, onPress }` | Section label with optional right-side action |
| `EmptyState` | `message: string; action?: { label, onPress }` | Friendly empty state, not "No data" |
| `SkeletonBox` | `width, height, radius?` | Loading placeholder |
| `PrimaryButton` | `label, onPress, isLoading?, disabled?` | Full-width primary CTA |
| `SecondaryButton` | `label, onPress, isLoading?` | Outlined variant |
| `GhostButton` | `label, onPress` | Text-only variant |

---

## Scope for Claude Code

Claude Code scaffolds the following — Derrick implements all screen and component UI:

1. **All files listed in the project structure** — empty but correctly named and placed
2. **`src/core/common/constants/`** — all constants files fully populated
3. **`src/core/common/network/api-client.ts`** — Axios instance with request/response interceptors, token refresh logic on 401
4. **`src/core/common/network/api-endpoints.ts`** — all endpoints populated
5. **`src/core/common/error/app-error.ts`** — error classes
6. **`src/core/common/utils/`** — all utility files with correct function signatures
7. **`src/core/common/interface/`** — shared interfaces
8. **`src/core/navigation/root-navigator.tsx`** — full navigator hierarchy with auth gating, all screen registrations, liquid glass tab bar config
9. **All `*.dto.ts` files** — Zod schemas and response DTO interfaces
10. **All `*.interface.ts` files** — domain interfaces
11. **All `*.mapper.ts` files** — mapper functions
12. **All `*.service.ts` files** — service functions calling `apiClient`
13. **All `*.state.ts` files** — Zustand stores
14. **All `hooks/use-*.ts` files** — query and mutation hooks per patterns above
15. **All `*.screen.tsx` files** — stub only: imports, props typing, `export default function XScreen() { return null; }`
16. **All `components/*.tsx` files** — stub only: typed props interface + `return null`

Claude Code does **not** implement screen UI, component rendering, or any JSX beyond stubs.

---

## Token Refresh Strategy

The `apiClient` response interceptor must handle token refresh silently:

1. On `401` response: attempt `AuthService.refreshToken(storedRefreshToken)`
2. If refresh succeeds: update stored access token, retry the original request once
3. If refresh fails: call `authStore.clearSession()` to trigger navigation to `UnauthenticatedStack`
4. Use a queue mechanism to prevent parallel refresh calls when multiple requests 401 simultaneously

---

## Post-Scaffold Checklist (Claude Code Must Run)

```bash
npm run lint
npm run format:check
npx tsc --noEmit
```

Report all touched files and any type errors before ending the session.
