export const API_ENDPOINTS = {
  // Auth
  AUTH_GOOGLE: "/auth/google",
  AUTH_APPLE: "/auth/apple",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",

  // Users
  USERS_ME: "/users/me",
  USERS_ME_ONBOARDING: "/users/me/onboarding",

  // Banks
  BANKS: "/banks",
  BANK_DETAIL: (id: number) => `/banks/${id}`,

  // Email connections
  EMAIL_CONNECTIONS: "/email-connections",
  EMAIL_CONNECTION_DETAIL: (id: number) => `/email-connections/${id}`,
  EMAIL_CONNECTION_LABELS: (id: number) => `/email-connections/${id}/labels`,
  EMAIL_CONNECTION_LABEL: (id: number) => `/email-connections/${id}/label`,
  EMAIL_CONNECTION_SYNC: (id: number) => `/email-connections/${id}/sync`,
  GMAIL_AUTH_URL: "/email-connections/google/auth-url",
  GMAIL_CALLBACK: "/email-connections/google/callback",

  // Transactions
  TRANSACTIONS: "/transactions",
  TRANSACTION_DETAIL: (id: number) => `/transactions/${id}`,
  TRANSACTIONS_SUMMARY: "/transactions/summary",
  TRANSACTIONS_UNVERIFIED: "/transactions/unverified",

  // Exchange rates
  EXCHANGE_RATES: "/exchange-rates",

  // Budgets
  BUDGETS: "/budgets",
  BUDGET_DETAIL: (id: number) => `/budgets/${id}`,
  BUDGET_CATEGORY_DETAIL: (id: number) => `/budgets/${id}/detail`,
  BUDGET_SUGGESTIONS: "/budgets/suggestions",

  // Goals
  GOALS: "/goals",
  GOAL_DETAIL: (id: number) => `/goals/${id}`,

  // Insights
  INSIGHTS: "/insights",
  INSIGHT_READ: (id: number) => `/insights/${id}/read`,
} as const;
