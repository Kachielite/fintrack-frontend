export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  onboardingComplete: boolean;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
