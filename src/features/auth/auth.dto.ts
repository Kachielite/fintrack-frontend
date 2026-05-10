import { z } from "zod";

export const googleSignInSchema = z.object({
  id_token: z.string(),
});

export const appleSignInSchema = z.object({
  id_token: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export type GoogleSignInSchemaType = z.infer<typeof googleSignInSchema>;
export type AppleSignInSchemaType = z.infer<typeof appleSignInSchema>;

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
