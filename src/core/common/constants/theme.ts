// Colours extracted from Fintrack design tokens (tokens.jsx — amber palette, light mode)
export const COLORS = {
  // Brand
  primary: "#C77638", // amber-500
  primaryDark: "#B25C24", // amber-600 — gradient end / hover
  primaryLight: "#FBF5EE", // amber-50 — soft tinted backgrounds
  primaryMid: "#F5E8D6", // amber-100

  // Surfaces — warm cream
  background: "#FAF6EF",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFCF6",
  surface2: "#F5EFE3", // muted fills, skeleton, dots

  // Borders
  border: "rgba(35, 28, 19, 0.08)",
  borderStrong: "rgba(35, 28, 19, 0.16)",

  // Text — warm near-black
  textPrimary: "#231C13",
  textSecondary: "rgba(35, 28, 19, 0.62)",
  textSubtle: "rgba(35, 28, 19, 0.42)",
  textInverse: "#FFFFFF",

  // Status
  success: "#5E8650",
  warning: "#C77638",
  error: "#B85948",

  // Category colours
  categoryFood: "#E8845A",
  categoryTransit: "#5A84B8",
  categoryUtility: "#8A6EB0",
  categorySubs: "#5AADA0",
  categoryTransfer: "#8A9E6B",
  categoryFun: "#D48A5A",
  categoryHealth: "#D45A7A",
  categoryOther: "#9A9A8A",
} as const;

export const FONTS = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
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
