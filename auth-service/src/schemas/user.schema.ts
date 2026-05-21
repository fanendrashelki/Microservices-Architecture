import { z } from 'zod'

/* ---------------- Common Validators ---------------- */
const emailSchema = z.string()
  .email('Invalid Email')

const passwordSchema = z.string().min(8, 'Password must be at least 8 character')
  .regex(/[A-Z]/, 'Password must contain at least one Upercase letter')
  .regex(/[0-9]/, "Password must contain at least one number")

const otpSchema = z
  .string()
  .length(4, "OTP must be 4 digits")
  .regex(/^\d+$/, "OTP must contain only numbers");

/* ---------------- Reusable Confirm Password Function ---------------- */

const validateConfirmPassword = (schema: any) =>
  schema.refine((data: any) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ---------------- Send Email Schema ---------------- */
export const sendEmailSchema = z.object({
  email: emailSchema
})

/* ---------------- User Schema ---------------- */
export const UserSchemas = validateConfirmPassword(z.object({
  fullName: z.string().trim().min(4, 'Full name must be at least 3 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(["User", "Worker", "Admin"]).optional()
}));

/* ---------------- Signup Schema ---------------- */
export const SignupSchema = UserSchemas.extend({
  otp: otpSchema
})

/* ---------------- Login Schema ---------------- */
export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
/* ---------------- forgot Password Schema ---------------- */
export const forgotPasswordSchema = z.object({
  email: emailSchema
})
/* ---------------- Verify Otp Schema ---------------- */
export const VerifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
})

/* ---------------- reset Password Schema  ---------------- */
export const resetPasswordSchema = validateConfirmPassword(z.object({
  resetToken: z.string()
    .trim()
    .min(1, 'Token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),

}))

/* ---------------- update Password Schema  ---------------- */
export const updatePasswordSchema = validateConfirmPassword(z
  .object({
    userId: z.string().trim().min(1, "User ID is required"),
    oldPassword: passwordSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  }).refine((data) => data.password !== data.oldPassword, {
    message: "New and old password cannot be the same",
    path: ["password"],
  }));


export type EmailType = z.infer<typeof sendEmailSchema>
export type UserType = z.infer<typeof UserSchemas>
export type SignupType = z.infer<typeof SignupSchema>
export type LoginType = z.infer<typeof LoginSchema>
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>
export type verifyOtpType = z.infer<typeof VerifyOtpSchema>
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordType = z.infer<typeof updatePasswordSchema>

