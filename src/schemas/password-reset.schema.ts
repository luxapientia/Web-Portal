import { z } from 'zod';
import { emailSchema, otpSchema, passwordSchema } from './auth.schema';

// Verification code schema
export const verifyCodeSchema = z.object({
  email: emailSchema,
  verificationCode: otpSchema,
});

// Password reset schema
export const resetPasswordSchema = z.object({
  email: emailSchema,
  verificationCode: otpSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>; 