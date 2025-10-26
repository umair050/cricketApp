import { z } from 'zod';

// Login DTO
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDTO = z.infer<typeof loginSchema>;

// Signup DTO
export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  dateOfBirth: z
    .string()
    .refine(
      (date) => {
        const dob = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        return age >= 13 || (age === 13 && monthDiff >= 0);
      },
      'You must be at least 13 years old'
    ),
  country: z.string().min(1, 'Country is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignupDTO = z.infer<typeof signupSchema>;

// Forgot Password DTO
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;

// Verify Reset Code DTO
export const verifyCodeSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

export type VerifyCodeDTO = z.infer<typeof verifyCodeSchema>;

// Reset Password DTO
export const resetPasswordSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>; 