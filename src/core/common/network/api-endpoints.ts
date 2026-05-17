export const API_ENDPOINTS = {
  // Auth
  AUTH_GOOGLE: "/auth/google",
  AUTH_APPLE: "/auth/apple",
  AUTH_DEMO: "/auth/demo",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",

  // Users
  USERS_ME: "/users/me",
  USERS_ME_ONBOARDING: "/users/me/onboarding",

  // Banks
  BANKS: "/banks",
  BANK_DETAIL: (id: number) => `/banks/${id}`,
  BANKS_REPORT_SENDER: "/banks/report-sender",

  // Email connections
  EMAIL_CONNECTIONS: "/email-connections",
  EMAIL_CONNECTION_DETAIL: (id: number) => `/email-connections/${id}`,
  EMAIL_CONNECTION_SYNC: (id: number) => `/email-connections/${id}/sync`,
  EMAIL_CONNECTION_STATS: (id: number) => `/email-connections/${id}/stats`,
  EMAIL_CONNECTION_DATA: (id: number) => `/email-connections/${id}/data`,
  GMAIL_AUTH_URL: "/email-connections/google/auth-url",
  GMAIL_CALLBACK: "/email-connections/google/callback",

  // Transactions
  TRANSACTIONS: "/transactions",
  TRANSACTION_DETAIL: (id: number) => `/transactions/${id}`,
  TRANSACTION_SIMILAR: (id: number) => `/transactions/${id}/similar`,
  TRANSACTIONS_SUMMARY: "/transactions/summary",
  TRANSACTIONS_UNVERIFIED: "/transactions/unverified",
  TRANSACTIONS_CHART_DATA: "/transactions/chart-data",
  TRANSACTIONS_BULK_CATEGORY: "/transactions/bulk-category",

  // Exchange rates
  EXCHANGE_RATES: "/exchange-rates",

  // Budgets
  BUDGETS: "/budgets",
  BUDGET_DETAIL: (id: number) => `/budgets/${id}`,
  BUDGET_CATEGORY_DETAIL: (id: number) => `/budgets/${id}/detail`,
  BUDGET_SUGGESTIONS: "/budgets/suggestions",
  BUDGET_AUTO_GENERATE: "/budgets/auto-generate",

  // Goals
  GOALS: "/goals",
  GOAL_DETAIL: (id: number) => `/goals/${id}`,

  // Insights
  INSIGHTS: "/insights",
  INSIGHT_READ: (id: number) => `/insights/${id}/read`,
  INSIGHTS_GENERATE: "/insights/generate",

  // Categories
  CATEGORIES: "/categories",

  // Notifications
  NOTIFICATIONS: "/notifications",
  NOTIFICATION_UNREAD_COUNT: "/notifications/unread-count",
  NOTIFICATION_READ: (id: number) => `/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: "/notifications/read-all",
  NOTIFICATIONS_DEVICE_TOKEN: "/notifications/device-token",
  NOTIFICATIONS_DEVICE_TOKEN_DELETE: (playerId: string) => `/notifications/device-token/${encodeURIComponent(playerId)}`,

  // Email sync SSE stream (not a standard API call — used directly with XHR)
  EMAIL_CONNECTION_SYNC_STREAM: (id: number) => `/email-connections/${id}/sync-stream`,
} as const;
