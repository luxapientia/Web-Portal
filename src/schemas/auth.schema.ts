import { z } from 'zod';

// ============= Constants =============
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'] as const;

// ============= Error Messages =============
export const authErrors = {
  required: 'This field is required',
  fullName: {
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
    length: 'Invitation code must be exactly 6 characters',
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
    (type) => ALLOWED_FILE_TYPES.includes(type as any),
    authErrors.files.type
  ),
});

// ============= Field Schemas =============
export const fullNameSchema = z.string()
  .min(2, authErrors.fullName.min)
  .max(50, authErrors.fullName.max)
  .regex(/^[a-zA-Z\s]*$/, authErrors.fullName.format)
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
  .length(6, authErrors.invitationCode.length)
  .regex(/^[A-Za-z0-9]*$/, authErrors.invitationCode.format);

export const otpSchema = z.string()
  .length(6, authErrors.otp.length)
  .regex(/^\d+$/, authErrors.otp.format);

// ============= Main Schemas =============
export const registrationSchema = z.object({
  fullName: fullNameSchema,
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

// ============= Types =============
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;
export type OtpVerificationData = z.infer<typeof otpVerificationSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>; 