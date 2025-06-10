import { z } from 'zod';

// ============= Constants =============
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'] as const;

// ============= Error Messages =============
export const authErrors = {
  required: 'This field is required',
  name: {
    min: 'Full name must be at least 2 characters',
    max: 'Full name cannot exceed 50 characters',
    format: 'Only letters and spaces are allowed',
  },
  phone: {
    invalid: 'Please enter a valid phone number with country code',
  },
  email: {
    invalid: 'Please enter a valid email address',
  },
  password: {
    min: 'At least 8 characters',
    uppercase: 'At least 1 uppercase letter',
    lowercase: 'At least 1 lowercase letter',
    number: 'At least 1 number',
    special: 'At least 1 special character (!@#$%^&*)',
  },
  idPassport: {
    min: 'ID/Passport number must be at least 5 characters',
    max: 'ID/Passport number cannot exceed 20 characters',
    format: 'Only letters, numbers, and hyphens are allowed',
  },
  invitationCode: {
    length: 'Invitation code must be exactly 8 characters',
    format: 'Only letters and numbers are allowed',
  },
  otp: {
    length: 'OTP must be exactly 6 digits',
    format: 'OTP must contain only numbers',
  },
  files: {
    required: 'Please upload the required file',
    type: `Only ${ALLOWED_FILE_TYPES.join(', ')} files are allowed`,
    size: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  },
} as const;

// ============= Base Schemas =============
export const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(MAX_FILE_SIZE, authErrors.files.size),
  type: z.string().refine(
    (type) => ALLOWED_FILE_TYPES.includes(type as (typeof ALLOWED_FILE_TYPES)[number]),
    authErrors.files.type
  ),
});

// ============= Field Schemas =============
export const nameSchema = z.string()
  .min(2, authErrors.name.min)
  .max(50, authErrors.name.max)
  .regex(/^[a-zA-Z\s]*$/, authErrors.name.format)
  .transform(val => val.trim());

export const phoneSchema = z.string()
  .min(1, authErrors.required)
  .regex(/^\+[1-9]\d{1,14}$/, authErrors.phone.invalid);

export const emailSchema = z.string()
  .min(1, authErrors.required)
  .email(authErrors.email.invalid)
  .toLowerCase();

export const passwordSchema = z.string()
  .min(8, authErrors.password.min)
  .regex(/[A-Z]/, authErrors.password.uppercase)
  .regex(/[a-z]/, authErrors.password.lowercase)
  .regex(/\d/, authErrors.password.number)
  .regex(/[!@#$%^&*]/, authErrors.password.special);

export const idPassportSchema = z.string()
  .min(5, authErrors.idPassport.min)
  .max(20, authErrors.idPassport.max)
  .regex(/^[A-Za-z0-9-]*$/, authErrors.idPassport.format);

export const invitationCodeSchema = z.string()
  .length(8, authErrors.invitationCode.length)
  .regex(/^[A-Za-z0-9]*$/, authErrors.invitationCode.format);

export const otpSchema = z.string()
  .length(6, authErrors.otp.length)
  .regex(/^\d+$/, authErrors.otp.format);

// ============= Main Schemas =============
export const registrationSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
  idPassport: idPassportSchema,
  invitationCode: invitationCodeSchema,
  otp: otpSchema,
});

export const emailVerificationSchema = z.object({
  email: emailSchema,
});

export const otpVerificationSchema = z.object({
  otp: otpSchema,
});

// Separate schema for file uploads
export const fileUploadSchema = z.object({
  idFront: fileSchema,
  idBack: fileSchema,
  selfie: fileSchema,
}).refine(
  (data) => {
    return data.idFront && data.idBack && data.selfie;
  },
  {
    message: 'All ID documents and selfie are required',
    path: ['files'],
  }
);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const walletInfoSchema = z.object({
  id: z.string(),
  type: z.string()
});

// ============= Auth Context Schemas =============
export const userSchema = z.object({
  id: z.string(),
  _id: z.string().optional(),
  name: nameSchema,
  email: emailSchema,
  image: z.string().optional(),
  phone: phoneSchema,
  idPassport: idPassportSchema,
  invitationCode: invitationCodeSchema.optional(),
  myInvitationCode: z.string(),
  isEmailVerified: z.boolean().default(false),
  isPhoneVerified: z.boolean().default(false),
  isIdVerified: z.boolean().default(false),
  role: z.enum(['user', 'admin']).default('user'),
  status: z.enum(['pending', 'active', 'suspended']).default('pending'),
  idDocuments: z.object({
    idFront: z.string().optional(),
    idBack: z.string().optional(),
    selfie: z.string().optional(),
  }).optional(),
  withdrawalWallet: walletInfoSchema.optional(),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});


// ============= Types =============
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;
export type OtpVerificationData = z.infer<typeof otpVerificationSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>; 
export type User = z.infer<typeof userSchema>;

// Define AuthContextType directly as an interface instead of using Zod inference
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}