import userModel from "../models/user.model.js"
import emailOTP from "../models/otp.model.js"
import sessionModel from "../models/session.model.js"
import passwordResetToken from "../models/passwordResetToken.js"

import { registerSchema, loginSchema, emailVerifySchema, resendOtpSchema, forgotPasswordSchema, verifyResetOtpSchema, resetPasswordSchema } from "../validator/auth.validator.js"
import { accessToken, refreshToken, setRefreshToken, hashtoken, clearCookieOptions, REFRESH_TOKEN_MAX_AGE } from "../utils/auth.utils.js"
import { generateOTP, hashOTP, safeEqual } from "../utils/otp.utils.js"
import { sendOtpEmail } from "../services/email.service.js"

import config from "../config/config.js"
import jwt from "jsonwebtoken"
import crypto from "crypto";
import bcrypt from "bcrypt"

import { OAuth2Client } from "google-auth-library"
import { error } from "console"
import { existsSync } from "fs"

const googleClient = new OAuth2Client(
    config.GOOGLE_ID
)

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

const FORGOT_PASSWORD_RESPONSE = "if an account exist with this email , a reset otp  has been sent"

const invalidInput = (res, result) =>
    res.status(400).json({
        message: "invalid input",
        errors: result.error.issues,
    })

const publicUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
})

async function issueSession(userId, req, res) {
    const newAccessToken = accessToken(userId);
    const newRefreshToken = refreshToken(userId);

    await sessionModel.create({
        user: userId,
        refreshTokenHash: hashtoken(newRefreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
        userAgent: req.get("user-agent") || "unknown",
        ip: req.ip || "unknown",

    })

    setRefreshToken(res, newRefreshToken);
    return newAccessToken;

}

async function createAndSendOtp(user) {
    const otp = generateOTP();

    await emailOTP.deleteMany({ user: user._id });
    await emailOTP.create({
        user: user._id,
        otpHash: hashOTP(otp, user._id),
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),

    })
    await sendOtpEmail(user.email, otp);
}

async function otpCooldownActive(userId) {
    const last = await emailOTP
        .findOne({ user: userId })
        .sort({ createdAt: -1 })
        .select("createdAt");
    return Boolean(last) && Date.now() - last.createdAt.getTime() < OTP_RESEND_COOLDOWN_MS;
}

async function generateUniqueUsername(name) {
    const base = (name || "user").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15) || "user";
    for (let i = 0; i < 5; i++) {
        const candidate = `${base}${crypto.randomInt(1000, 9999)}`;
        if (!(await userModel.exists({ username: candidate }))) return candidate;
    }
    return `${base}${Date.now()}`;
}

async function googleLogin(req, res) {
    try {
        const { credential } = req.body

        if (typeof credential !== "string" || !credential) {
            return res.status(400).json({
                message: "google credentials are required"
            })
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: config.GOOGLE_ID
        })

        const { sub: googleId, email: rawEmail, name, email_verified } = ticket.getPayload();

        if (!email_verified) {
            return res.status(400).json({
                message: "email is not verified"
            })
        }

        const email = rawEmail.toLowerCase();

        let user = (await userModel.findOne({ googleId })) ||
            (await userModel.findOne({ email }));

        if (user) {
            let changed = false;

            if (!user.isVerified) {
                user.password = undefined;
                user.isVerified = true;
                changed = true;
            }
            if (user.googleId !== googleId) {
                user.googleId = googleId;
                changed = true;
            }

            if (changed) await user.save();
        } else {
            user = await userModel.create({
                username: await generateUniqueUsername(name),
                email,
                googleId,
                authProvider: "google",
                isVarified: true,
            });
        }

        const newAccessToken = await issueSession(user._id, req, res);
        return res.status(200).json({
            message: "you have been logged in successfully",
            accessToken: newAccessToken,
            user: publicUser(user),
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "google authentication failed"
        })
    }
}

async function registerUser(req, res) {

    try {

        const result = registerSchema.safeParse(req.body)

        if (!result.success) return invalidInput(res, result);

        const { username, email, password } = result.data

        //check if user already exist 
        const existUser = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        })

        if (existUser) {
            const retryable = !existUser.isVerified && existUser.email === email;

            if (!retryable) {
                return res.status(409).json({ message: "user already exist " })
            }

            if (existUser.username !== username) {
                const token = await userModel.exist({
                    username,
                    _id: { $ne: existsSync._id },
                });
                if (taken) {
                    return res.status(409).json({ message: "user already exist" })
                }
                existUser.username = username;
            }

            if (await otpCooldownActive(existUser._id)) {
                return res.status(429).json({
                    message: "please wait a minute befor requesting another otp",
                })
            }

            existUser.password = password;
            await existUser.save();

            try {
                await createAndSendOtp(existUser);
            } catch (err) {
                console.error("OTP email failed:", err);
                return res.status(502).json({
                    message: "could not send varification email, try again",
                })
            }

            res.status(200).json({
                message: "otp sent to you email",
                userId: existUser._id,
            });
        }
        //create user
        const user = await userModel.create({
            username,
            email,
            password
        })

        try {
            await createAndSendOtp(user);
        } catch (err) {
            await emailOTP.deleteMany({ user: user._id });
            await userModel.deleteMany({ _id: user._id });
            console.error("OTP email failed:", err);
            return res.status(502).json({
                message: "could not send varificaion email, try again"
            });
        }

        return res.status(201).json({
            message: "account created ,otp sent to you email",
            userId: user._id,
        })

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "user already exist" });

        }
        console.log(err);
        return res.status(500).json({
            message: "server error"
        })
    }
}

async function emailVerify(req, res) {
    try {
        const result = emailVerifySchema.safeParse(req.body);
        if (!result.success) return invalidInput(res, result);

        const { userId, otp } = result.data;

        //find otp
        const otpRecord = await emailOTP.findOneAndUpdate(
            {
                user: userId,
                expiresAt: { $gt: new Date() },
                attempts: { $lt: MAX_OTP_ATTEMPTS },
            },
            { $inc: { attempts: 1 } },
             { returnDocument: "after" }
        );

        if (!otpRecord) {
            return res.status(400).json({
                message: "otp expired or too many attempts, request a new one"
            });
        }

        if (!safeEqual(hashOTP(otp, userId), otpRecord.otpHash)) {
            return res.status(400).json({ message: "invalid otp" })
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        user.isVerified = true;
        await user.save();
        await emailOTP.deleteOne({ _id: otpRecord._id });
        const newAccessToken = await issueSession(user._id, req, res);
        return res.status(201).json({
            message: "you have been registerd successfully",
            accessToken: newAccessToken,
            user: publicUser(user),
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

async function resendOTP(req, res) {
    try {
        const result = resendOtpSchema.safeParse(req.body);
        if (!result.success) return invalidInput(res, result);

        const { userId } = result.data;
        

        // 1. Find user
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 2. If already verified, don't send another OTP
        if (user.isVerified) {
            return res.status(400).json({
                message: "Email is already verified"
            });
        }

        if (await otpCooldownActive(user._id)) {
            return res.status(429).json({
                message: "please wait a minute befor requesting another otp"
            });
        }

        await createAndSendOtp(user);



        return res.status(200).json({
            message: "New OTP sent to your email"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to resend OTP"
        });
    }
}

async function loginUser(req, res) {

    try {
        const result = loginSchema.safeParse(req.body)


        if (!result.success) {
            return invalidInput(res, result);
        }

        const { email, password } = result.data

        const user = await userModel.findOne({ email }).select("+password");

        if (!user || !user.password) {
            return res.status(401).json({
                message: "invalid email or password..."
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "invalid email or password"
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Email is not verified",
                userId: user._id
            });
        }

        const newAccessToken = await issueSession(user._id, req, res);


        res.status(200).json({
            message: "you have been loged successfully",
            accessToken: newAccessToken,
            user: publicUser(user)
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "server error"
        })
    }
}

async function forgetPassword(req, res) {
    try {
        const result = forgotPasswordSchema.safeParse(req.body);
        if (!result.success) return invalidInput(res, result);

        const {email} = result.data

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(200).json({
                message: FORGOT_PASSWORD_RESPONSE
            })
        }

        const recent = await passwordResetToken.findOne({
            user: user._id,
            createdAt: { $gt: new Date(Date.now() - OTP_RESEND_COOLDOWN_MS) },
        })

        if (recent) {
            return res.status(200).json({ message: FORGOT_PASSWORD_RESPONSE })
        }

        await passwordResetToken.deleteMany({
            user: user._id
        })

        // 3. Generate new OTP
        const otp = generateOTP();



        await passwordResetToken.create({
            user: user._id,
            otpHash: hashOTP(otp, user._id),
            expiresAt: new Date(Date.now() + OTP_EXPIRY_MS)
        })

        await sendOtpEmail(user.email, otp, "reset");

        return res.status(200).json({
            message: FORGOT_PASSWORD_RESPONSE
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}

async function verifyOtp(req, res) {
    try {

        const result = verifyResetOtpSchema.safeParse(req.body);
        if (!result.success) return invalidInput(res,result);

        const { email, otp } = result.data

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "invalid or expired reset request"
            })
        }


        const resetRecord = await passwordResetToken.findOneAndUpdate({
            user: user._id,
            usedAt: null,
            expiresAt: { $gt: new Date() },
            attemptes: { $lt: MAX_OTP_ATTEMPTS },

        },

            { $inc: { attemptes: 1 } },
            { new: true }
        )

        if (!resetRecord) {
            return res.status(400).json({
                message: "invalid or expired otp"
            })
        }

        if (!safeEqual(hashOTP(otp, user._id), resetRecord.otpHash)) {
            return res.status(400).json({ message: "invalid otp" })
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        resetRecord.resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        resetRecord.resetTokenExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
        await resetRecord.save();

        await resetRecord.save()

        return res.status(200).json({
            message: "otp is verified successfully",
            resetToken,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "server error"
        })
    }
}

async function resetPassword(req, res) {
    try {

        const result = resetPasswordSchema.safeParse(req.body);
        if (!result.success) return invalidInput(res, result)

        const { newPassword, resetToken } = result.data;

        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")

        const resetTokenRecord = await passwordResetToken.findOneAndUpdate({
            resetTokenHash,
            usedAt: null,
            resetTokenExpiresAt: { $gt: new Date() }
        })

        if (!resetTokenRecord) {
            return res.status(400).json({
                message: "invalid or expired reset token"
            })
        }

        const user = await userModel.findById(resetTokenRecord.user)

        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }

        user.password = newPassword;
        await user.save();

        await sessionModel.updateMany(
            { user: user._id, revokedAt: null },
            { revokedAt: new Date() }
        );
        res.clearCookie("refreshToken", clearCookieOptions)

        return res.status(200).json({
            message: "password reset successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "sever error"
        })
    }

}

async function refreshAccessToken(req, res) {

    try {

        const oldRefreshToken = req.cookies?.refreshToken;

        if (!oldRefreshToken) {
            return res.status(401).json({
                message: "unotherized"
            })
        }

        const decoded = jwt.verify(oldRefreshToken, config.REFRESH);



        const session = await sessionModel.findOneAndUpdate({
            user: decoded.id,
            refreshTokenHash: hashtoken(oldRefreshToken),
            revokedAt: null,
            expiresAt: { $gt: new Date() }
        },
            { revokedAt: new Date() })

        if (!session) {
            return res.status(401).json({
                message: "invalid session"
            })
        }
        const newAccessToken=await issueSession(decoded.id,req,res);
       
        
        return res.status(200).json({
            accessToken: newAccessToken
        })

    } catch (err) {
        console.log(err)
        return res.status(401).json({
            message: "invalid or expired token"
        })
    }
}

async function logoutUser(req, res) {
    try {

        const refreshTokenFromCookies = req.cookies?.refreshToken;

        if (refreshTokenFromCookies) {

            await sessionModel.findOneAndUpdate(
                {
                    refreshTokenHash: hashtoken(refreshTokenFromCookies),
                    revokedAt: null
                },
                {
                    revokedAt: new Date()
                }
            )
        }

     res.clearCookie("refreshToken",clearCookieOptions);

        return res.status(200).json({
            message: "log out successfully"
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong"
        })

    }
}

async function logoutAllDevices(req, res) {
    try {

        await sessionModel.updateMany(
            {user: req.user._id, revokedAt: null},
            {revokedAt: new Date() }
        )

        res.clearCookie("refreshToken",clearCookieOptions)

        return res.status(200).json({
            message: "log out successfully"
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

async function getMe(req, res) {
    try {
        res.status(200).json({
            message: "user fetched successfuly",
            user:{
                id:req.user._id,
                username:req.user.username,
                email:req.user.email,
                role:req.user.role
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server Error"
        })
    }

}

export {
    registerUser, emailVerify, loginUser,
    logoutUser, getMe, refreshAccessToken,
    logoutAllDevices, resendOTP, forgetPassword,
    verifyOtp, resetPassword, googleLogin
}