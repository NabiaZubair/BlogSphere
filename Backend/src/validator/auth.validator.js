import {z} from "zod";

const email=z.string().trim().toLowerCase().email("invalid email address")

const password=z
.string()
.min(8,"password must be at least 9 characters")
.max(72,"password must be at most 72 characters");

const otp=z.string().trim().regex(/^\d{6}$/,"otp must be 6 digit")

const objectId=z.string().regex(/^[a-f\d]{24}$/,"invalid id")

const registerSchema=z.object({
    username:z
    .string()
    .trim()
    .min(3,"Username must be  at least 3 characters")
    .max(30,"Username must be less then 30 characters"),
    email,
    password,
});


const loginSchema=z.object({
    email,
    password:z.string().min(1,"password is required")
});


const emailVerifySchema=z.object({userId:objectId,otp});
const resendOtpSchema=z.object({userId:objectId});
const forgotPasswordSchema=z.object({email});
const verifyResetOtpSchema=z.object({email,otp});
const resetPasswordSchema=z.object({
    resetToken:z.string().regex(/^[a-f\d]{64}$/,"invalid reset token"),
    newPassword:password,
})

export {registerSchema,loginSchema,emailVerifySchema,resendOtpSchema,forgotPasswordSchema,verifyResetOtpSchema,resetPasswordSchema};