import { z } from 'zod';

// Base user schema
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

// Registration input schema
export const registerUserSchema = userSchema;

// Login input schema
export const loginUserSchema = userSchema.pick({
  email: true,
  password: true,
});

// Update user schema (all fields optional)
export const updateUserSchema = userSchema
  .partial()
  .omit({ password: true });

// Response schemas (without password)
export const userResponseSchema = userSchema
  .extend({
    _id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    role: z.enum(['user', 'admin']).default('user'),
  })
  .omit({ password: true });

// Types
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>; 