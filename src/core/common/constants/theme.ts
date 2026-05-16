// Design tokens extracted from Fintrack/tokens.jsx — amber palette, light + dark modes
export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryMid: string;
  onPrimary: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  surface2: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textSubtle: string;
  success: string;
  warning: string;
  warningLight: string;
  warningMid: string;
  error: string;
}

export const LIGHT_COLORS: ThemeColors = {
  primary: "#C77638",
  primaryDark: "#B25C24",
  primaryLight: "#FBF5EE",
  primaryMid: "#F5E8D6",
  onPrimary: "#FFFFFF",
  background: "#FAF6EF",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFCF6",
  surface2: "#F5EFE3",
  border: "rgba(35, 28, 19, 0.08)",
  borderStrong: "rgba(35, 28, 19, 0.16)",
  textPrimary: "#231C13",
  textSecondary: "rgba(35, 28, 19, 0.62)",
  textSubtle: "rgba(35, 28, 19, 0.42)",
  success: "#5E8650",
  warning: "#9A6B1A",
  warningLight: "#FDF8EE",
  warningMid: "#F0DC9A",
  error: "#B85948",
};

export const DARK_COLORS: ThemeColors = {
  primary: "#D69356",
  primaryDark: "#E2B47C",
  primaryLight: "rgba(214, 147, 86, 0.15)",
  primaryMid: "rgba(214, 147, 86, 0.25)",
  onPrimary: "#1B1209",
  background: "#141210",
  surface: "#1C1916",
  surfaceElevated: "#252119",
  surface2: "#2E2920",
  border: "rgba(245, 239, 230, 0.10)",
  borderStrong: "rgba(245, 239, 230, 0.18)",
  textPrimary: "#F5EFE6",
  textSecondary: "rgba(245, 239, 230, 0.62)",
  textSubtle: "rgba(245, 239, 230, 0.42)",
  success: "#7BAE6B",
  warning: "#D4B04A",
  warningLight: "rgba(212, 176, 74, 0.12)",
  warningMid: "rgba(212, 176, 74, 0.28)",
  error: "#D87466",
};

// Category colours are the same in both modes — used for chip/badge fills
export const CATEGORY_COLORS: Record<string, string> = {
  peer_to_peer_transfer: "#5AADA0",
  business_payment: "#5A84B8",
  subscriptions: "#8A6EB0",
  entertainment_leisure: "#D48A5A",
  mobile_internet: "#5A9EB8",
  utilities: "#7BA05B",
  groceries: "#E8845A",
  retail_ecommerce: "#D4A05A",
  dining_food_delivery: "#D45A5A",
  transport: "#5A6EB0",
  fuel_auto: "#6E8A5A",
  travel: "#5AB8A0",
  bank_charges: "#B05A6E",
  currency_conversion: "#8A8A5A",
  salary_wages: "#5AB05A",
  refunds_reimbursements: "#5A8A8A",
  healthcare: "#D45A7A",
  education: "#5A7AD4",
  charity_donations: "#D45AB0",
  cash_withdrawal: "#9A8A5A",
  uncategorized: "#9A9A8A",
  investment: "#4A90A4",
  savings: "#3A8C6E",
  rent_housing: "#7A6AA0",
  family_support: "#D4845A",
  beauty_personal_care: "#D45A8A",
  gifts_social: "#D4A05A",
};

export const FALLBACK_CATEGORY_COLOR = "#9A9A8A";

export const FONTS = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
  mono: "SpaceMono_400Regular",
} as const;

export const FONT_SIZE = {
  display: 40,
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
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;
