import { z } from "zod";

export const googleSignInSchema = z.object({
  id_token: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().optional(),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
export type SignUpSchemaType = z.infer<typeof signUpSchema>;

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
