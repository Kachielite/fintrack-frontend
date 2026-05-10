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
