import {Router} from "express";
import { registerUser, emailVerify,loginUser,logoutUser ,refreshAccessToken,getMe,
    logoutAllDevices,resendOTP,forgetPassword,resetPassword, verifyOtp,googleLogin} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {authLimiter} from "../middleware/rateLimit.middleware.js"
const authRoutes=Router();

authRoutes.post("/google-login",authLimiter,googleLogin)
authRoutes.post("/register",authLimiter,registerUser);
authRoutes.post("/email-verify",authLimiter,emailVerify);
authRoutes.post("/resend-otp",authLimiter,resendOTP);
authRoutes.post("/forget-password",authLimiter,forgetPassword)
authRoutes.post("/verify-otp",authLimiter,verifyOtp)
authRoutes.post("/reset-password",authLimiter,resetPassword)
authRoutes.post("/login",authLimiter,loginUser);
authRoutes.get("/refresh-token",refreshAccessToken);
authRoutes.post("/logout",logoutUser);
authRoutes.post("/logout-all",authMiddleware,logoutAllDevices)
authRoutes.get("/get-me",authMiddleware,getMe)



export default authRoutes