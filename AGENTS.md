# AGENTS.md

## Purpose

This file is the enforcement policy for AI agents working in this repository.

If a user request conflicts with this policy, stop and ask for clarification before making changes.

## Rule Priority (Highest to Lowest)

1. Direct user instruction for the current task.
2. This `AGENTS.md` policy.
3. Existing codebase patterns already present in the repo.
4. Personal or default agent preferences.

## Repository Structure (Source of Truth)

Agents must preserve this layout and place new files in the correct area.

```text
billbot-frontend/
  app.json
  babel.config.js
  index.ts
  package.json
  tsconfig.json
  android/
  ios/
  assets/                          ← static app-store / splash assets (NOT src/core/assets)
  src/
    App.tsx
    core/
      assets/                      ← shared in-app static assets (images, fonts, etc.)
      common/
        components/                ← shared UI components (ScreenContainer, SkeletonBox, etc.)
        constants/                 ← theme, fonts, env, query-keys, storage-keys, etc.
        error/                     ← app-level error helpers (AppError, UnauthorizedError, etc.)
        hooks/                     ← shared hooks (use-load-fonts, use-theme-colors, etc.)
        interface/                 ← shared interfaces/types used across multiple features
        network/                   ← HTTP client setup and network helpers
        state/                     ← shared global state (theme.state.ts, etc.)
        utils/                     ← generic utilities (currency, date, storage)
      navigation/                  ← Central navigation layer (see Navigation Architecture below)
        index.ts
        navigation-ref.ts
        root-navigator.tsx
    features/
      activities/
        components/
        hooks/
        activities.dto.ts
        activities.interface.ts
        activities.mapper.ts
        activities.screen.tsx      ← screen at feature root (no screens/ subfolder)
        activities.service.ts
      auth/
        components/
        hooks/
        auth.dto.ts
        auth.interface.ts
        auth.mapper.ts
        auth.screen.tsx            ← screen at feature root (no screens/ subfolder)
        auth.service.ts
        auth.state.ts
        auth.validator.ts
      balances/
      categories/
      expenses/
        components/
        hooks/
        screens/
          expense.screen.tsx
          expenses.screen.tsx
          new-expense-home.screen.tsx
          new-expense.screen.tsx
          upcoming-expenses.screen.tsx
        expenses.dto.ts
        expenses.interface.ts
        expenses.mapper.ts
        expenses.service.ts
        expenses.state.ts
      groups/
        components/
        hooks/
        screens/
          edit-group.screen.tsx
          group.screen.tsx
          groups.screen.tsx
          manage-members.screen.tsx
          new-group.screen.tsx
        groups.dto.ts
        groups.interface.ts
        groups.mapper.ts
        groups.service.ts
        groups.state.ts
      home/
        components/
        home.screen.tsx            ← screen at feature root (no screens/ subfolder)
      invites/
        components/
        hooks/
        screens/
          invite-members.screen.tsx
          join-group-code.screen.tsx
          join-group-token.screen.tsx
        invites.dto.ts
        invites.interface.ts
        invites.mapper.ts
        invites.service.ts
      notifications/
        components/
        hooks/
        screens/
          notification-preferences.screen.tsx
          notifications.screen.tsx
        notifications.dto.ts
        notifications.interface.ts
        notifications.mapper.ts
        notifications.push.interface.ts
        notifications.service.ts
        notifications.state.ts
      pools/
        components/
        screens/
          edit-pool.screen.tsx
          new-pool.screen.tsx
          pool.screen.tsx
          pools.screen.tsx
      settlements/
        components/
        hooks/
        screens/
          dispute-settlement.screen.tsx
          record-payment.screen.tsx
          settle-up-home.screen.tsx
          settlement.screen.tsx
          settlements.screen.tsx
        settlements.dto.ts
        settlements.interface.ts
        settlements.mapper.ts
        settlements.service.ts
        settlements.state.ts
      user/
        screens/
          privacy-policy.screen.tsx
          profile.screen.tsx
          terms-of-service.screen.tsx
      webhooks/
```

## Placement Rules

### Root Files

- Keep framework and tool config at root only (`app.json`, `babel.config.js`, `tsconfig.json`, `eslint.config.js`,
  `package.json`).
- Do not add feature business logic in root.

### `src/`

- `src/App.tsx` remains the main app composition entry in source code.
- Put reusable platform-agnostic building blocks in `src/core/`.
- Put domain-specific logic in `src/features/<feature-name>/`.

### `src/core/`

- `core/assets/`: static assets shared across features.
- `core/common/constants/`: global constants and theme/environment constants.
- `core/common/components/`: shared, reusable UI components.
- `core/common/hooks/`: shared hooks that are not tied to a single feature.
- `core/common/network/`: HTTP client setup and network helpers.
- `core/common/state/`: shared global state slices (e.g., theme).
- `core/common/utils/`: generic utilities.
- `core/common/interface/`: shared interfaces/types used across multiple features.
- `core/common/error/`: app-level error helpers.
- `core/navigation/`: **Navigation layer only** — root navigator, navigation ref, and barrel export.
  Do not put feature screens or business logic here.

### `src/features/`

Each feature must stay self-contained.

For a feature `<x>`, keep files in this pattern unless the user asks otherwise:

- `<x>.dto.ts`
- `<x>.interface.ts`
- `<x>.mapper.ts`
- `<x>.service.ts`
- `<x>.state.ts`
- `<x>.validator.ts` (if validation logic exists)
- `hooks/use-*.ts`
- `components/` — feature-specific UI components
- `screens/<x>.screen.tsx` or `<x>.screen.tsx` at the feature root (see pattern note below)

**Screen placement pattern:**
- Features with a single screen place it at the feature root: `<feature>/<feature>.screen.tsx`
  (e.g., `auth/auth.screen.tsx`, `home/home.screen.tsx`, `activities/activities.screen.tsx`).
- Features with multiple screens use a `screens/` subfolder
  (e.g., `groups/screens/`, `expenses/screens/`, `settlements/screens/`).

Do not move files from one feature to another without explicit user approval.

---

## Dependencies

These are the canonical project dependencies. Do not install anything not listed here without explicit approval.

```bash
# HTTP client
axios

# Server state — queries and mutations
@tanstack/react-query

# Client state management
zustand

# Async storage (session token persistence)
@react-native-async-storage/async-storage

# Navigation
@react-navigation/native  @react-navigation/bottom-tabs  @react-navigation/native-stack
react-native-screens  react-native-safe-area-context

# Auth
@react-native-google-signin/google-signin
@invertase/react-native-apple-authentication

# Image picker (receipt + proof uploads)
react-native-image-picker

# Form handling + validation
react-hook-form
zod
@hookform/resolvers

# Toast notifications
toastify-react-native        ← used as <ToastProvider /> in App.tsx; import Toast from 'toastify-react-native'

# Date utility
date-fns
```

---

## Core Layer — Constants, Interfaces, Network, Utils

### `src/core/common/constants/env.ts`

```typescript
export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.billbot.app/v1',
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  APPLE_BUNDLE_ID: process.env.EXPO_PUBLIC_APPLE_BUNDLE_ID ?? 'app.billbot',
} as const;
```

### `src/core/common/constants/storage-keys.ts`

```typescript
export const STORAGE_KEYS = {
  SESSION_TOKEN: '@billbot/session_token',
  USER_PROFILE: '@billbot/user_profile',
  COLOR_SCHEME: '@billbot/color_scheme',
} as const;
```

### `src/core/common/constants/query-keys.ts`

These are the **only** valid query key strings. Always import from this file — never hardcode strings.

```typescript
export const QUERY_KEYS = {
  ME: 'me',
  GROUPS: 'groups',
  GROUP_DETAIL: 'group-detail',
  GROUP_POOLS: 'group-pools',
  POOL_DETAIL: 'pool-detail',
  POOL_EXPENSES: 'pool-expenses',
  POOL_BALANCES: 'pool-balances',
  POOL_SETTLEMENTS: 'pool-settlements',
  EXPENSE_DETAIL: 'expense-detail',
  SETTLEMENT_DETAIL: 'settlement-detail',
  NOTIFICATIONS: 'notifications',
  CATEGORIES: 'categories',
  GROUP_INVITES: 'group-invites',
  GROUP_WEBHOOKS: 'group-webhooks',
  USER_BALANCES: 'user-balances',
  UPCOMING_EXPENSES: 'upcoming-expenses',
  USER_ACTIVITIES: 'user-activities',
} as const;
```

### `src/core/common/interface/api-response.interface.ts`

```typescript
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

### `src/core/common/interface/pagination.interface.ts`

```typescript
export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total_items: number;
  pages: number;
  items: T[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
```

### `src/core/common/error/app-error.ts`

```typescript
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super('Session expired. Please sign in again.', 401, 'UNAUTHORIZED');
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found.`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
```

### `src/core/common/network/api-endpoints.ts`

```typescript
export const API_ENDPOINTS = {
  AUTH_GOOGLE: '/auth/google',
  AUTH_APPLE: '/auth/apple',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  USERS_ME: '/users/me',
  USERS_SEARCH: '/users/search',
  GROUPS: '/groups',
  GROUP_DETAIL: (groupId: string) => `/groups/${groupId}`,
  GROUP_REMOVE_MEMBER: (groupId: string, userId: string) => `/groups/${groupId}/members/${userId}`,
  GROUP_INVITES: (groupId: string) => `/groups/${groupId}/invites`,
  GROUP_INVITE_CANCEL: (groupId: string, inviteId: string) => `/groups/${groupId}/invites/${inviteId}`,
  GROUP_JOIN: (token: string) => `/groups/join/${token}`,
  GROUP_POOLS: (groupId: string) => `/groups/${groupId}/pools`,
  POOL_DETAIL: (poolId: string) => `/pools/${poolId}`,
  POOL_MEMBERS: (poolId: string) => `/pools/${poolId}/members`,
  POOL_REMOVE_MEMBER: (poolId: string, userId: string) => `/pools/${poolId}/members/${userId}`,
  POOL_EXPENSES: (poolId: string) => `/pools/${poolId}/expenses`,
  POOL_PARSE_RECEIPT: (poolId: string) => `/pools/${poolId}/expenses/parse-receipt`,
  EXPENSE_DETAIL: (expenseId: string) => `/expenses/${expenseId}`,
  EXPENSE_RECURRENCE: (poolId: string, expenseId: string) => `/pools/${poolId}/expenses/${expenseId}/recurrence`,
  POOL_BALANCES: (poolId: string) => `/pools/${poolId}/balances`,
  POOL_SETTLEMENTS: (poolId: string) => `/pools/${poolId}/settlements`,
  SETTLEMENT_DETAIL: (settlementId: string) => `/settlements/${settlementId}`,
  SETTLEMENT_CONFIRM: (settlementId: string) => `/settlements/${settlementId}/confirm`,
  SETTLEMENT_DISPUTE: (settlementId: string) => `/settlements/${settlementId}/dispute`,
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: '/notifications/read-all',
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (categoryId: string) => `/categories/${categoryId}`,
  GROUP_WEBHOOKS: (groupId: string) => `/groups/${groupId}/webhooks`,
  GROUP_WEBHOOK_DELETE: (groupId: string, webhookId: string) => `/groups/${groupId}/webhooks/${webhookId}`,
} as const;
```

### `src/core/common/network/api-client.ts`

Axios instance with:
- Base URL from `ENV.API_BASE_URL`
- **Request interceptor**: reads session token from AsyncStorage, attaches `Authorization: Bearer <token>`
- **Response interceptor**: on 401 → clears token from storage and throws `UnauthorizedError`; on other non-2xx →
  throws `AppError` with `statusCode` and `message` extracted from the response body

Exports:
```typescript
export const apiClient: AxiosInstance
export async function setAuthToken(token: string | null): Promise<void>
export async function getAuthToken(): Promise<string | null>
```

### `src/core/common/utils/storage.ts`

Typed `AsyncStorage` wrapper:
```typescript
export async function saveItem(key: string, value: unknown): Promise<void>
export async function getItem<T>(key: string): Promise<T | null>
export async function removeItem(key: string): Promise<void>
export async function clearAll(): Promise<void>
```

### `src/core/common/utils/currency.ts`

```typescript
// NGN → ₦, KES → KSh, GHS → GH₵, ZAR → R
export function formatCurrency(amount: number | string, currency?: string): string
export function parseCurrency(value: string): number
```

### `src/core/common/utils/date.ts`

Thin wrappers around `date-fns`:
```typescript
export function formatDate(date: string | Date): string       // 'Apr 13, 2025'
export function formatRelative(date: string | Date): string   // '2 hours ago'
export function formatShort(date: string | Date): string      // 'Apr 13'
export function isToday(date: string | Date): boolean
export function isFuture(date: string | Date): boolean
```

---

## Data Layer Architecture — File Roles

Every feature follows a strict four-layer data pipeline:

| File | Role | What belongs here |
|---|---|---|
| `<x>.dto.ts` | API contract | Zod schemas + inferred types for every **request** body; plain TS interfaces for every **response** shape |
| `<x>.interface.ts` | Domain model | Clean camelCase interfaces — `number` for amounts, `Date` for timestamps |
| `<x>.mapper.ts` | Transformation | Pure `fromDto → interface` mapping functions — no side effects |
| `<x>.service.ts` | Network calls | Async functions calling `apiClient`, returning mapped interfaces, throwing `AppError` |
| `<x>.state.ts` | Client state | Zustand store for data that must persist across screens (token, unread count, caches) |

### DTO File Pattern

Every `.dto.ts` exports two things per request shape: a **Zod schema** and its **inferred TypeScript type**.
API response shapes are plain TS interfaces (they are outputs, not validated inputs).

Schema naming convention:
- Schema: `<action><Feature>Schema` — e.g. `createGroupSchema`, `logExpenseSchema`
- Type: `<Action><Feature>SchemaType` — e.g. `CreateGroupSchemaType`, `LogExpenseSchemaType`

```typescript
import { z } from 'zod';

// ── Request schemas (Zod — user inputs) ───────────────────────────────────
export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
  description: z.string().max(500).optional(),
});
export type CreateGroupSchemaType = z.infer<typeof createGroupSchema>;

// ── Response DTOs (plain TS interfaces — API outputs) ─────────────────────
export interface GroupDto {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string | null;
  created_at: string;
}
```

> **Do NOT define Zod schemas inside hook files.** All schemas belong exclusively in `.dto.ts` files.

### Mapper File Pattern

Mappers are pure functions with no side effects. They convert snake_case API DTOs into camelCase domain interfaces
and parse `string` timestamps into `Date` objects and `string` amounts into `number`.

```typescript
import type { GroupDto } from './groups.dto';
import type { Group } from './groups.interface';

export function mapGroupFromDto(dto: GroupDto): Group {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    inviteCode: dto.invite_code,
    createdBy: dto.created_by,
    createdAt: new Date(dto.created_at),
  };
}
```

### Service File Pattern

Services call `apiClient` and return mapped domain models. They never return raw DTOs.

```typescript
import { apiClient } from '@/core/common/network/api-client';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { mapGroupFromDto } from './groups.mapper';
import type { Group } from './groups.interface';
import type { CreateGroupSchemaType } from './groups.dto';

export const GroupsService = {
  async listGroups(): Promise<Group[]> {
    const res = await apiClient.get(API_ENDPOINTS.GROUPS);
    return res.data.data.map(mapGroupFromDto);
  },

  async createGroup(data: CreateGroupSchemaType): Promise<Group> {
    const res = await apiClient.post(API_ENDPOINTS.GROUPS, data);
    return mapGroupFromDto(res.data.data);
  },
};
```

### State File Pattern (Zustand)

```typescript
import { create } from 'zustand';
import type { Group } from './groups.interface';

interface GroupsState {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  removeGroup: (id: string) => void;
  updateGroup: (id: string, patch: Partial<Group>) => void;
}

const useGroupsStore = create<GroupsState>((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
  addGroup: (group) => set((s) => ({ groups: [...s.groups, group] })),
  removeGroup: (id) => set((s) => ({ groups: s.groups.filter((g) => g.id !== id) })),
  updateGroup: (id, patch) =>
    set((s) => ({ groups: s.groups.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
));

export default useGroupsStore;
```

---

## Hook Patterns

There are two hook patterns. Apply the correct one based on whether the hook **reads** data or **mutates** it.

### GET hooks — `useQuery`

```typescript
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { GroupsService } from '../groups.service';

const useGroups = () => {
  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.GROUPS],
    () => GroupsService.listGroups(),
  );

  return { groups: data ?? [], isLoading, error, refetch };
};

export default useGroups;
```

For queries that depend on a parameter (e.g. `groupId`), include it in the key array:
```typescript
useQuery([QUERY_KEYS.GROUP_DETAIL, groupId], () => GroupsService.getGroupDetail(groupId))
```

For conditional queries (e.g. enabled only when input is long enough):
```typescript
useQuery([QUERY_KEYS.USERS_SEARCH, phone], () => UserService.searchByPhone(phone), {
  enabled: phone.length > 6,
})
```

### POST / PUT / DELETE hooks with user input — `useForm` + `useMutation`

Every mutation hook that takes **user input** must use `useForm` with a Zod schema sourced from the feature's `.dto.ts`.

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error/app-error';
import { createGroupSchema, type CreateGroupSchemaType } from '../groups.dto';
import { GroupsService } from '../groups.service';

const useCreateGroup = () => {
  const queryClient = useQueryClient();

  const form = useForm<CreateGroupSchemaType>({
    resolver: zodResolver(createGroupSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { isLoading: isCreating, mutateAsync: createGroup } = useMutation(
    ['create-group'],
    async (data: CreateGroupSchemaType) => {
      return GroupsService.createGroup({ name: data.name, description: data.description });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUPS]);
        Toast.show({ type: 'success', text1: 'Group created successfully' });
        form.reset();
      },
      onError: (error: AppError) => {
        const message = error.message ?? 'An error occurred';
        Toast.show({ type: 'error', text1: message });
      },
    },
  );

  return { form, isCreating, createGroup };
};

export default useCreateGroup;
```

**Mandatory rules for mutation hooks with user input:**
- Schema and its inferred type **always** come from the `.dto.ts` file — never define them in the hook
- Always call `queryClient.invalidateQueries([QUERY_KEYS.<key>])` on success for every affected query
- Always show `Toast` on both success and error
- Always call `form.reset()` on success
- `useForm` mode is `'onBlur'` by default

### Action-only mutations — `useMutation` only (no form)

Used when there is **no user input** (confirm, delete, mark-read operations):

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error/app-error';
import { GroupsService } from '../groups.service';

const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutateAsync: deleteGroup } = useMutation(
    (groupId: string) => GroupsService.deleteGroup(groupId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUPS]);
        Toast.show({ type: 'success', text1: 'Group deleted' });
      },
      onError: (error: AppError) => {
        Toast.show({ type: 'error', text1: error.message ?? 'An error occurred' });
      },
    },
  );

  return { deleteGroup, isDeleting };
};

export default useDeleteGroup;
```

---

## Feature Reference — Schemas, Interfaces, Hooks

Each feature's data contracts and hook signatures are defined below. Agents must match these exactly.

### Feature: `auth`

**Zod schemas (`auth.dto.ts`)**
- `googleSignInSchema` — `{ idToken: string }`
- `appleSignInSchema` — `{ identityToken: string; fullName?: { givenName?, familyName? } | null; email?: string | null }`

**Response DTOs** — `UserDto`, `AuthResponseDto { token, user, isNewUser }`

**Domain interfaces (`auth.interface.ts`)**
- `AuthUser { id, name, email, avatarUrl, createdAt: Date }`
- `AuthSession { token, user: AuthUser, isNewUser }`

**Mappers** — `mapAuthUserFromDto`, `mapAuthSessionFromDto`

**Service** (`auth.service.ts`)
- `signInWithGoogle(idToken): Promise<AuthSession>` → POST `/auth/google`
- `signInWithApple(payload): Promise<AuthSession>` → POST `/auth/apple`
- `logout(): Promise<void>` → POST `/auth/logout` then clear token
- `getMe(): Promise<AuthUser>` → GET `/auth/me`

**Zustand store** (`auth.state.ts`)
- State: `user: AuthUser | null`, `token: string | null`, `isAuthenticated: boolean`, `isLoading: boolean`
- Actions: `setSession(session)`, `clearSession()`, `initSession()` (reads token → calls getMe → populates user),
  `updateUser(patch)`

**Hooks**
- `use-google-sign-in.ts` — `useMutation` only (OAuth flow) → `{ signIn, isLoading, error }`
- `use-apple-sign-in.ts` — `useMutation` only (OAuth flow) → `{ signIn, isLoading, error }`

---

### Feature: `user`

**Zod schemas (`user.dto.ts`)**
- `updateProfileSchema` — `{ name?, email?, phone?, avatar_url? }`
  - `phone` validated with `/^\+[1-9]\d{1,14}$/`

**Response DTOs** — `UserProfileDto`, `UserSummaryDto`

**Domain interfaces (`user.interface.ts`)**
- `UserProfile { id, name, phone, email, avatarUrl, createdAt: Date }`
- `UserSummary { id, name, email, avatarUrl }`

**Mappers** — `mapUserProfileFromDto`, `mapUserSummaryFromDto`

**Service** (`user.service.ts`)
- `getProfile(): Promise<UserProfile>` → GET `/users/me`
- `updateProfile(data): Promise<UserProfile>` → PUT `/users/me`
- `searchByPhone(phone): Promise<UserSummary>` → GET `/users/search?phone=`

**Zustand store** (`user.state.ts`) — `profile: UserProfile | null`, actions: `setProfile`, `clearProfile`

**Hooks**
- `use-profile.ts` — `useQuery([QUERY_KEYS.ME])` → `{ profile, isLoading, error, refetch }`
- `use-update-profile.ts` — `useForm<UpdateProfileSchemaType>` + `useMutation`, invalidates `QUERY_KEYS.ME`
  → `{ form, isUpdating, updateProfile }`
- `use-search-user.ts` — `useQuery` enabled when `phone.length > 6` → `{ result, isLoading, error }`

---

### Feature: `groups`

**Zod schemas (`groups.dto.ts`)**
- `createGroupSchema` — `{ name: string (min 1, max 100); description?: string (max 500) }`

**Response DTOs** — `GroupDto`, `GroupMemberDto`, `GroupDetailDto extends GroupDto`

**Domain interfaces (`groups.interface.ts`)**
- `Group { id, name, description, inviteCode, createdBy, createdAt: Date }`
- `GroupMember { userId, name, email, avatarUrl, role: 'admin'|'member', joinedAt: Date }`
- `GroupDetail extends Group { members: GroupMember[] }`

**Mappers** — `mapGroupFromDto`, `mapGroupMemberFromDto`, `mapGroupDetailFromDto`

**Service** (`groups.service.ts`)
- `listGroups(): Promise<Group[]>` → GET `/groups`
- `getGroupDetail(groupId): Promise<GroupDetail>` → GET `/groups/:groupId`
- `createGroup(data): Promise<Group>` → POST `/groups`
- `deleteGroup(groupId): Promise<void>` → DELETE `/groups/:groupId`
- `removeMember(groupId, userId): Promise<void>` → DELETE `/groups/:groupId/members/:userId`

**Zustand store** (`groups.state.ts`) — `groups: Group[]`, actions: `setGroups`, `addGroup`, `removeGroup`,
`updateGroup`

**Hooks**
- `use-groups.ts` — `useQuery([QUERY_KEYS.GROUPS])` → `{ groups, isLoading, error, refetch }`
- `use-group-detail.ts` — `useQuery([QUERY_KEYS.GROUP_DETAIL, groupId])` → `{ group, isLoading, error, refetch }`
- `use-create-group.ts` — `useForm<CreateGroupSchemaType>` + `useMutation`, invalidates `GROUPS`
  → `{ form, isCreating, createGroup }`
- `use-delete-group.ts` — `useMutation` only → `{ deleteGroup, isDeleting }`
- `use-remove-member.ts` — `useMutation` only → `{ removeMember, isRemoving }`

---

### Feature: `invites`

**Zod schemas (`invites.dto.ts`)**
- `createInviteSchema` — `{ phone?: string; email?: string }` with `.refine()` requiring at least one of phone/email
- `joinGroupSchema` — `{ token: string (min 1) }`

**Response DTOs** — `InviteDto { id, group_id, invited_by, phone, email, token, status, expires_at, created_at }`

**Domain interfaces (`invites.interface.ts`)**
- `Invite { id, groupId, invitedBy, phone, email, token, status: 'pending'|'accepted'|'expired', expiresAt: Date, createdAt: Date }`

**Mappers** — `mapInviteFromDto`

**Service** (`invites.service.ts`)
- `createInvite(groupId, data): Promise<Invite>` → POST `/groups/:groupId/invites`
- `listInvites(groupId): Promise<Invite[]>` → GET `/groups/:groupId/invites`
- `cancelInvite(groupId, inviteId): Promise<void>` → DELETE `/groups/:groupId/invites/:inviteId`
- `joinGroup(token): Promise<void>` → POST `/groups/join/:token`

**Hooks**
- `use-list-invites.ts` — `useQuery([QUERY_KEYS.GROUP_INVITES, groupId])` → `{ invites, isLoading, error, refetch }`
- `use-create-invite.ts` — `useForm<CreateInviteSchemaType>` + `useMutation`, invalidates `GROUP_INVITES`
  → `{ form, isInviting, createInvite }`
- `use-join-group.ts` — `useForm<JoinGroupSchemaType>` + `useMutation`, invalidates `GROUPS` on success
  → `{ form, isJoining, joinGroup }`
- `use-cancel-invite.ts` — `useMutation` only → `{ cancelInvite, isCancelling }`

---

### Feature: `pools`

**Zod schemas (`pools.dto.ts`)**
- `createPoolSchema` — `{ name: string, description?: string, memberIds: string[] (min 1) }`
- `updatePoolSchema` — `{ name?, description?, status?: 'active'|'settled'|'closed' }`

**Response DTOs** — `PoolDto`, `PoolMemberDto`, `PoolDetailDto extends PoolDto`

**Domain interfaces (`pools.interface.ts`)**
- `Pool { id, groupId, name, description, status, splitType, createdBy, createdAt: Date }`
- `PoolMember { poolId, userId, joinedAt: Date }`
- `PoolDetail extends Pool { members: PoolMember[] }`

**Mappers** — `mapPoolFromDto`, `mapPoolMemberFromDto`, `mapPoolDetailFromDto`

**Service** (`pools.service.ts`)
- `listGroupPools(groupId): Promise<Pool[]>` → GET `/groups/:groupId/pools`
- `getPoolDetail(poolId): Promise<PoolDetail>` → GET `/pools/:poolId`
- `createPool(groupId, data): Promise<Pool>` → POST `/groups/:groupId/pools`
- `updatePool(poolId, data): Promise<Pool>` → PUT `/pools/:poolId`
- `addMember(poolId, userId): Promise<void>` → POST `/pools/:poolId/members`
- `removeMember(poolId, userId): Promise<void>` → DELETE `/pools/:poolId/members/:userId`

**Zustand store** (`pools.state.ts`) — `poolsByGroup: Record<string, Pool[]>`, actions: `setGroupPools`, `addPool`,
`updatePool`

**Hooks**
- `use-group-pools.ts` — `useQuery([QUERY_KEYS.GROUP_POOLS, groupId])` → `{ pools, isLoading, error, refetch }`
- `use-pool-detail.ts` — `useQuery([QUERY_KEYS.POOL_DETAIL, poolId])` → `{ pool, isLoading, error, refetch }`
- `use-create-pool.ts` — `useForm<CreatePoolSchemaType>` + `useMutation`, invalidates `GROUP_POOLS`
  → `{ form, isCreating, createPool }`
- `use-update-pool.ts` — `useForm<UpdatePoolSchemaType>` + `useMutation`, invalidates `POOL_DETAIL`
  → `{ form, isUpdating, updatePool }`
- `use-pool-members.ts` — `useMutation` only (both add and remove) → `{ addMember, removeMember, isLoading }`

---

### Feature: `expenses`

**Zod schemas (`expenses.dto.ts`)**
- `logExpenseSchema` — `{ amount: number (positive), description?, categoryId?, currency: 'NGN'|'KES'|'GHS'|'ZAR', isRecurring: boolean, recurrenceFrequency?, recurrenceEndDate? }`
  with `.refine()`: recurring expenses must have `recurrenceFrequency`

**Response DTOs** — `SplitDto`, `ExpenseDto`, `ParsedReceiptDto`, `ParseReceiptResponseDto`

**Domain interfaces (`expenses.interface.ts`)**
- `Split { id, expenseId, owedBy, amount: number, settled: boolean, settledAt: Date | null }`
- `Expense { id, poolId, paidBy, amount: number, currency, description, categoryId, receiptUrl, createdAt: Date,
  isRecurring, recurrenceFrequency, recurrenceEndDate: Date | null, nextOccurrenceAt: Date | null, splits: Split[] }`
- `ParsedReceipt { amount, currency, merchant, description, category, date }`
- `ParseReceiptResult { parsed: ParsedReceipt | null, receiptUrl: string }`

**Mappers** — `mapSplitFromDto`, `mapExpenseFromDto`, `mapParsedReceiptFromDto`

**Service** (`expenses.service.ts`)
- `listExpenses(poolId, params?): Promise<PaginatedResponse<Expense>>` → GET `/pools/:poolId/expenses`
- `getExpense(expenseId): Promise<Expense>` → GET `/expenses/:expenseId`
- `logExpense(poolId, data, receipt?): Promise<Expense>` → POST `/pools/:poolId/expenses` (multipart/form-data)
- `parseReceipt(poolId, image): Promise<ParseReceiptResult>` → POST `/pools/:poolId/expenses/parse-receipt` (multipart)
- `deleteExpense(expenseId): Promise<void>` → DELETE `/expenses/:expenseId`
- `cancelRecurrence(poolId, expenseId): Promise<void>` → DELETE `/pools/:poolId/expenses/:expenseId/recurrence`

**Zustand store** (`expenses.state.ts`):
```typescript
// draftExpense: Partial<LogExpenseSchemaType> & { receiptUrl?: string; parsedReceipt?: ParsedReceipt }
// setDraftExpense(patch): void
// clearDraftExpense(): void
```

**Hooks**
- `use-pool-expenses.ts` — `useQuery` paginated → `{ expenses, isLoading, error, refetch }`
- `use-expense-detail.ts` — `useQuery([QUERY_KEYS.EXPENSE_DETAIL, expenseId])` → `{ expense, isLoading, error }`
- `use-log-expense.ts` — `useForm<LogExpenseSchemaType>` + `useMutation`, invalidates `POOL_EXPENSES` and
  `POOL_BALANCES`; receipt image passed separately into mutation → `{ form, isLogging, logExpense }`
- `use-parse-receipt.ts` — `useMutation` only; on success calls `expenses.state.setDraftExpense({ parsedReceipt, receiptUrl })`
  → `{ parseReceipt, result, isParsing }`
- `use-delete-expense.ts` — `useMutation` only → `{ deleteExpense, isDeleting }`
- `use-cancel-recurrence.ts` — `useMutation` only → `{ cancelRecurrence, isCancelling }`

---

### Feature: `balances`

No Zod schemas — read-only feature.

**Response DTOs** — `BalanceEntryDto`, `MemberSummaryDto`, `PoolBalancesDto`

**Domain interfaces (`balances.interface.ts`)**
- `BalanceEntry { from: UserSummary, to: UserSummary, amount: number, currency: string }`
- `MemberSummary { user: UserSummary, totalPaid: number, totalOwed: number, netBalance: number }`
- `PoolBalances { balances: BalanceEntry[], memberSummary: MemberSummary[] }`

**Mappers** — `mapPoolBalancesFromDto`

**Service** (`balances.service.ts`)
- `getPoolBalances(poolId): Promise<PoolBalances>` → GET `/pools/:poolId/balances`

**Hooks**
- `use-pool-balances.ts` — `useQuery([QUERY_KEYS.POOL_BALANCES, poolId])`
  → `{ balances, memberSummary, myNetBalance, myDebts, isLoading, error, refetch }`
  (derives `myNetBalance` and `myDebts` from current user id read from `auth.state`)

---

### Feature: `settlements`

**Zod schemas (`settlements.dto.ts`)**
- `submitSettlementSchema` — `{ toUserId: string (uuid), amount: number (positive), note?: string (max 500) }`
- `disputeSettlementSchema` — `{ reason: string (min 1, max 500) }`

**Response DTOs** — `SettlementDto`

**Domain interfaces (`settlements.interface.ts`)**
- `SettlementStatus = 'pending_verification' | 'settled' | 'disputed'`
- `Settlement { id, poolId, fromUser, toUser, amount: number, currency, proofUrl, note, status, disputedReason,
  confirmedAt: Date | null, createdAt: Date }`

**Mappers** — `mapSettlementFromDto`

**Service** (`settlements.service.ts`)
- `listSettlements(poolId): Promise<Settlement[]>` → GET `/pools/:poolId/settlements`
- `getSettlement(settlementId): Promise<Settlement>` → GET `/settlements/:settlementId`
- `submitSettlement(poolId, data, proof): Promise<Settlement>` → POST `/pools/:poolId/settlements` (multipart)
- `confirmSettlement(settlementId): Promise<void>` → POST `/settlements/:settlementId/confirm`
- `disputeSettlement(settlementId, reason): Promise<void>` → POST `/settlements/:settlementId/dispute`

**Zustand store** (`settlements.state.ts`) — `pendingSettlements: Settlement[]`, actions: `setPendingSettlements`,
`removeSettlement`

**Hooks**
- `use-pool-settlements.ts` — `useQuery([QUERY_KEYS.POOL_SETTLEMENTS, poolId])` → `{ settlements, isLoading, error, refetch }`
- `use-settlement-detail.ts` — `useQuery([QUERY_KEYS.SETTLEMENT_DETAIL, settlementId])` → `{ settlement, isLoading, error }`
- `use-submit-settlement.ts` — `useForm<SubmitSettlementSchemaType>` + `useMutation`, invalidates `POOL_SETTLEMENTS`
  and `POOL_BALANCES`; proof image passed separately → `{ form, isSubmitting, submitSettlement }`
- `use-confirm-settlement.ts` — `useMutation` only → `{ confirmSettlement, isConfirming }`
- `use-dispute-settlement.ts` — `useForm<DisputeSettlementSchemaType>` + `useMutation`
  → `{ form, isDisputing, disputeSettlement }`

---

### Feature: `notifications`

No Zod schemas — no user input request bodies.

**Response DTOs** — `NotificationDto`, `NotificationsResponseDto`

**Domain interfaces (`notifications.interface.ts`)**
- `NotificationType = 'invite.received' | 'expense.created' | 'settlement.submitted' | 'settlement.confirmed' |
  'settlement.disputed' | 'member.joined' | string`
- `Notification { id, userId, type, title, body, metadata, isRead, createdAt: Date }`

**Mappers** — `mapNotificationFromDto`

**Service** (`notifications.service.ts`)
- `listNotifications(params?): Promise<{ items: Notification[]; unread: number } & PaginatedResponse<Notification>>`
  → GET `/notifications`
- `markRead(id): Promise<void>` → PATCH `/notifications/:id/read`
- `markAllRead(): Promise<void>` → PATCH `/notifications/read-all`

**Zustand store** (`notifications.state.ts`) — `unreadCount: number`, actions: `setUnreadCount`,
`decrementUnread`, `clearUnread`

**Hooks**
- `use-notifications.ts` — `useQuery([QUERY_KEYS.NOTIFICATIONS])` paginated
  → `{ notifications, unreadCount, isLoading, error, refetch }`
- `use-mark-read.ts` — `useMutation` only; on success decrements `notifications.state.unreadCount`
  → `{ markRead, isMarking }`
- `use-mark-all-read.ts` — `useMutation` only; on success calls `notifications.state.clearUnread`
  → `{ markAllRead, isMarking }`

---

### Feature: `categories`

No Zod schemas — read-only feature.

**Response DTOs** — `CategoryDto { id, slug, name, description, emoji, group, is_active }`

**Domain interfaces (`categories.interface.ts`)**
- `Category { id, slug, name, description, emoji, group, isActive: boolean }`

**Mappers** — `mapCategoryFromDto`

**Service** (`categories.service.ts`)
- `listCategories(): Promise<Category[]>` → GET `/categories`
- `getCategory(categoryId): Promise<Category>` → GET `/categories/:categoryId`

**Zustand store** (`categories.state.ts`) — `categories: Category[]`, actions: `setCategories`

**Hooks**
- `use-categories.ts` — `useQuery([QUERY_KEYS.CATEGORIES])` fetches once and caches → `{ categories, isLoading, error }`

---

### Feature: `webhooks`

**Zod schemas (`webhooks.dto.ts`)**
- `webhookEventTypes` — `as const` array of 12 event strings
- `registerWebhookSchema` — `{ url: string (valid URL), events: WebhookEventType[] (min 1) }`

**Response DTOs** — `WebhookDto { id, group_id, url, events, created_by, created_at, secret? }`

**Domain interfaces (`webhooks.interface.ts`)**
- `Webhook { id, groupId, url, events, createdBy, createdAt: Date, secret? }`

**Mappers** — `mapWebhookFromDto`

**Service** (`webhooks.service.ts`)
- `listWebhooks(groupId): Promise<Webhook[]>` → GET `/groups/:groupId/webhooks`
- `registerWebhook(groupId, data): Promise<Webhook>` → POST `/groups/:groupId/webhooks`
- `deleteWebhook(groupId, webhookId): Promise<void>` → DELETE `/groups/:groupId/webhooks/:webhookId`

**Hooks**
- `use-group-webhooks.ts` — `useQuery([QUERY_KEYS.GROUP_WEBHOOKS, groupId])` → `{ webhooks, isLoading, error, refetch }`
- `use-register-webhook.ts` — `useForm<RegisterWebhookSchemaType>` + `useMutation`, invalidates `GROUP_WEBHOOKS`
  → `{ form, isRegistering, registerWebhook }`
- `use-delete-webhook.ts` — `useMutation` only → `{ deleteWebhook, isDeleting }`

---

## Navigation Architecture

### Library & API

The app uses **React Navigation v7 Static API**:

- `@react-navigation/native` — core (hooks, types, `createStaticNavigation`)
- `@react-navigation/native-stack` — `createNativeStackNavigator`, `createNativeStackScreen`
- `@react-navigation/bottom-tabs` — `createBottomTabNavigator`, `createBottomTabScreen`

All navigators are configured with the **static** factory functions (not `NavigationContainer`). The resulting
navigator component is created via `createStaticNavigation(navigator)`.

### Navigation Files (`src/core/navigation/`)

| File | Role |
|---|---|
| `root-navigator.tsx` | Defines all navigators, screen registrations, auth gating, and exports `Navigation` component |
| `navigation-ref.ts` | Imperative ref — `createNavigationContainerRef()`. Use for navigation outside React (e.g., push notifications) |
| `index.ts` | Barrel export: `Navigation`, `navigationRef` |

### Navigator Hierarchy

```
Navigation (component)
├── UnauthenticatedNavigation   ← shown when token === null
│   └── UnauthenticatedStack (NativeStack)
│       └── Authentication → AuthScreen
└── TabsNavigation              ← shown when token !== null
    └── AuthenticatedStack (NativeStack)   ← recreated on theme change via useMemo
        ├── Tabs (BottomTab)
        │   ├── Home      → HomeScreen
        │   ├── Activity  → ActivitiesScreen
        │   ├── Groups    → GroupsScreen
        │   └── Profile   → ProfileScreen
        ├── NewGroup              → NewGroupScreen
        ├── Group                 → GroupScreen                 params: { groupId, fromQuickActions? }
        ├── InviteMembers         → InviteMembersScreen
        ├── EditGroup             → EditGroupScreen
        ├── ManageMembers         → ManageMembersScreen
        ├── NewExpenseHome        → NewExpenseHomeScreen        presentation: transparentModal
        ├── NewExpense            → NewExpenseScreen            presentation: card
        ├── Expenses              → ExpensesScreen
        ├── UpcomingExpenses      → UpcomingExpensesScreen
        ├── Expense               → ExpenseScreen               params: { poolId, expenseId }
        ├── NewPool               → NewPoolScreen               presentation: transparentModal, params: { groupId }
        ├── EditPool              → EditPoolScreen              presentation: transparentModal
        ├── Pool                  → PoolScreen                  params: { poolId }
        ├── Pools                 → PoolsScreen                 params: { groupId }
        ├── SettleUpHome          → SettleUpHomeScreen          presentation: transparentModal
        ├── DisputeSettlement     → DisputeSettlementScreen     presentation: transparentModal, params: { settlementId, poolId }
        ├── Settlements           → SettlementsScreen           params: { poolId }
        ├── Settlement            → SettlementScreen            params: { settlementId, poolId }
        ├── RecordPayment         → RecordPaymentScreen         presentation: transparentModal, params: { poolId, toUserId?, amount? }
        ├── Notifications         → NotificationsScreen
        ├── NotificationPreferences → NotificationPreferencesScreen
        ├── JoinGroupByToken      → JoinGroupTokenScreen        presentation: transparentModal
        ├── JoinGroupByCode       → JoinGroupCodeScreen         presentation: transparentModal
        ├── TermsOfService        → TermsOfServiceScreen
        └── PrivacyPolicy         → PrivacyPolicyScreen
```

### Auth Gating

`Navigation` reads `useAuthStore((state) => state.token)`:
- `token !== null` → renders `TabsNavigation` (authenticated stack)
- `token === null` → renders `UnauthenticatedNavigation`

Both navigators receive the same `navigationRef` so imperative navigation always targets the active navigator.

### Global Type Augmentation

`root-navigator.tsx` augments `@react-navigation/core` so the static API type-checks all `navigate()` calls
globally:

```ts
declare module '@react-navigation/core' {
  interface RootNavigator extends AuthenticatedStackType {}
}
```

### In-Component Navigation

Inside React components, use the `useNavigation` hook from `@react-navigation/native`:

```ts
import { useNavigation } from '@react-navigation/native';

// Typed navigate (preferred when types are known):
const navigation = useNavigation();
navigation.navigate('Group', { groupId: '...' });
navigation.goBack();
navigation.canGoBack();

// Untyped navigate (current pattern when TypeScript inference is complex):
const nav = useNavigation() as any;
nav.navigate('ScreenName', params);
```

> **Note:** Many screens currently cast `useNavigation()` to `any`. When adding new screens prefer typed navigation
> when possible, but follow the existing `as any` pattern for consistency until the codebase is migrated.

### Screen Props (Params)

Screens that receive route params must type their props with `StaticScreenProps`:

```ts
import { StaticScreenProps } from '@react-navigation/native';

type Props = StaticScreenProps<{ poolId: string; expenseId: string }>;

export default function ExpenseScreen({ route }: Props) {
  const { poolId, expenseId } = route.params;
}
```

### Imperative Navigation (Outside React)

Use `navigationRef` for navigation triggered outside the React tree (e.g., push notification tap handlers):

```ts
import { navigationRef } from '@/core/navigation';

if (navigationRef.isReady()) {
  const nav = navigationRef as any;
  nav.navigate('Group', { groupId });
}
```

### Modal Presentations

Several screens use bottom-sheet-style modal presentation. Always use these options for consistency:

```ts
{
  headerShown: false,
  presentation: 'transparentModal',
  animation: 'slide_from_bottom',
  animationDuration: 50,
}
```

Screens currently using `transparentModal`: `NewExpenseHome`, `NewPool`, `EditPool`, `SettleUpHome`,
`DisputeSettlement`, `RecordPayment`, `JoinGroupByToken`, `JoinGroupByCode`.

### Adding a New Screen

1. Create the screen file in the correct feature folder (see Screen placement pattern above).
2. Import the screen in `src/core/navigation/root-navigator.tsx`.
3. Register it in `createAuthenticatedStack` (or `UnauthenticatedStack` if pre-auth).
4. If the screen receives params, type it with `StaticScreenProps<{ ... }>`.
5. No changes needed to `navigation-ref.ts` or `index.ts` unless a new export is required.

---

## Naming Conventions

- Feature folders: lowercase, singular/plural based on existing pattern
  (`auth`, `user`, `groups`, `expenses`, `pools`, `settlements`, `invites`, `notifications`, `activities`, `home`,
  `balances`, `categories`, `webhooks`).
- Hook files: `use-<action>.ts` with kebab-case file names.
- Feature support files: `<feature>.<role>.ts` (`auth.service.ts`, `user.state.ts`).
- Screen files: `<name>.screen.tsx` (e.g., `group.screen.tsx`, `new-group.screen.tsx`).
- Component files: `<name>.tsx` or `<feature>.<role>.tsx` (e.g., `home.balances.tsx`, `group-card.tsx`).
- Keep file names consistent with the existing feature naming style.

---

## Import Rules

- Prefer alias-based imports from `@/` for cross-folder imports (`@` maps to `src` in both `tsconfig.json` and
  `babel.config.js`).
- Use relative imports only for same-folder or direct child-folder files.
- Avoid deep relative paths like `../../../` when `@/` can be used.

---

## Boundary Rules

- `core/` must not depend on `features/`.
- `core/navigation/` may import feature screens (it is the composition root for routing).
- A feature may depend on `core/`.
- A feature should not directly depend on another feature unless the user explicitly asks for cross-feature coupling.
- Keep native folders (`ios/`, `android/`) isolated from feature-level TypeScript logic.

---

## Protected and Generated Areas

Treat these as restricted unless the task explicitly targets them:

- `android/build/`, `android/app/build/`
- `ios/build/`, `ios/Pods/`
- `.expo/`, `node_modules/`

Do not manually edit generated artifacts.

---

## App Configuration Safety

- `app.json` is sensitive. Update paths and identifiers only when requested.
- If changing asset paths in `app.json`, verify target files exist before editing references.
- Keep `ios.bundleIdentifier` and `android.package` aligned with explicit user requirements.

---

## Pre-Change Checklist (Agents Must Follow)

Before editing:

1. Identify the smallest valid scope of files.
2. Confirm target folder matches rules above.
3. Confirm naming pattern for new files.
4. Confirm imports will follow `@/` alias policy.

---

## Post-Change Checklist (Agents Must Follow)

After editing code files:

1. Run lint for touched files or run repo lint if scoped lint is unavailable.
2. Run formatting checks for touched files.
3. Run type checks when TypeScript files are changed.
4. Report what changed and why, with exact file paths.

Suggested commands:

```bash
npm run lint
npm run format:check
npx tsc --noEmit
```

---

## Forbidden Actions

- Do not create new top-level architecture folders without explicit approval.
- Do not relocate existing feature files for style reasons only.
- Do not introduce a new naming convention when one already exists.
- Do not edit native/generated directories unless the task is explicitly native/build related.
- Do not add screen registrations to any file other than `src/core/navigation/root-navigator.tsx`.
- Do not define Zod schemas inside hook files — schemas belong in `.dto.ts` files only.
- Do not write JSX in service, state, mapper, DTO, or hook files.
- Do not install packages not listed in the Dependencies section.

---

## Change Request Protocol

If the task requires violating this policy, the agent must:

1. Pause implementation.
2. State which rule would be violated.
3. Ask for explicit approval and the intended new structure.
4. Proceed only after user confirmation.

---

Following this policy is mandatory for all AI-assisted edits in this repository.
