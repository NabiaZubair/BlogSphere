import crypto from "crypto";
import config from "../config/config.js";


export const generateOTP=()=>{
    return crypto.randomInt(100000,1000000).toString();
}

export const hashOTP=(otp,userId)=>{
    return crypto.createHash("sha256",config.OTP_SECRET)
    .update(`${userId}:${otp}`)
    .digest("hex")
};



