import rateLimit from "express-rate-limit";

// For login, register, OTP and password-reset routes only.
// Do NOT put it on refresh-token or get-me, real users call those often.
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    // relaxed in development so Postman testing doesn't lock you out
    max: process.env.NODE_ENV === "production" ? 20 : 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "too many attempts, please try again later" },
});