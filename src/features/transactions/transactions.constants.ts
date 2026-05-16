// Local constants for category icon names (Ionicons), labels, and color keys.
// Used as fast local fallbacks for display. The authoritative list of categories
// comes from the API via useCategories() — used in pickers and filters.

export const CATEGORY_ICON_NAMES: Record<string, string> = {
  peer_to_peer_transfer: "people-outline",
  business_payment: "briefcase-outline",
  subscriptions: "tv-outline",
  entertainment_leisure: "game-controller-outline",
  mobile_internet: "wifi-outline",
  utilities: "flash-outline",
  groceries: "basket-outline",
  retail_ecommerce: "bag-handle-outline",
  dining_food_delivery: "restaurant-outline",
  transport: "car-outline",
  fuel_auto: "car-sport-outline",
  travel: "airplane-outline",
  bank_charges: "card-outline",
  currency_conversion: "repeat-outline",
  investment: "trending-up-outline",
  savings: "save-outline",
  rent_housing: "home-outline",
  salary_wages: "wallet-outline",
  refunds_reimbursements: "return-down-back-outline",
  healthcare: "heart-outline",
  education: "school-outline",
  charity_donations: "heart-circle-outline",
  cash_withdrawal: "cash-outline",
  family_support: "people-circle-outline",
  beauty_personal_care: "color-palette-outline",
  gifts_social: "gift-outline",
  uncategorized: "ellipsis-horizontal-outline",
};

export function getCategoryIconName(slug: string): string {
  return CATEGORY_ICON_NAMES[slug] ?? "ellipsis-horizontal-outline";
}

export const CATEGORY_LABELS: Record<string, string> = {
  peer_to_peer_transfer: "Peer Transfer",
  business_payment: "Business Payment",
  subscriptions: "Subscriptions",
  entertainment_leisure: "Entertainment",
  mobile_internet: "Mobile & Internet",
  utilities: "Utilities",
  groceries: "Groceries",
  retail_ecommerce: "Retail & Shopping",
  dining_food_delivery: "Dining & Delivery",
  transport: "Transport",
  fuel_auto: "Fuel & Auto",
  travel: "Travel",
  bank_charges: "Bank Charges",
  currency_conversion: "FX Conversion",
  investment: "Investment",
  savings: "Savings",
  rent_housing: "Rent & Housing",
  salary_wages: "Salary & Wages",
  refunds_reimbursements: "Refunds",
  healthcare: "Healthcare",
  education: "Education",
  charity_donations: "Charity",
  cash_withdrawal: "Cash Withdrawal",
  family_support: "Family Support",
  beauty_personal_care: "Beauty & Care",
  gifts_social: "Gifts & Social",
  uncategorized: "Uncategorized",
};

/** Returns a human-readable label for any category slug, with formatted-slug fallback. */
export function getCategoryLabel(slug: string): string {
  if (CATEGORY_LABELS[slug]) return CATEGORY_LABELS[slug];
  return slug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const ALL_CATEGORIES: string[] = Object.keys(CATEGORY_LABELS);
