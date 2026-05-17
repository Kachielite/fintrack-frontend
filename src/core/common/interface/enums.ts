export type CategoryEnum =
  | "peer_to_peer_transfer"
  | "business_payment"
  | "subscriptions"
  | "entertainment_leisure"
  | "mobile_internet"
  | "utilities"
  | "groceries"
  | "retail_ecommerce"
  | "dining_food_delivery"
  | "transport"
  | "fuel_auto"
  | "travel"
  | "bank_charges"
  | "currency_conversion"
  | "salary_wages"
  | "refunds_reimbursements"
  | "healthcare"
  | "education"
  | "charity_donations"
  | "cash_withdrawal"
  | "uncategorized";

export type TransactionTypeEnum = "debit" | "credit";

export type GoalTypeEnum = "save" | "debt" | "daily" | "specific";

export type PayFrequencyEnum = "weekly" | "biweekly" | "monthly" | "irregular";

export type AdvisorToneEnum = "encouraging" | "direct" | "analytical";

export type CurrencyEnum =
  | "NGN"
  | "USD"
  | "GBP"
  | "EUR"
  | "GHS"
  | "KES"
  | "ZAR";
