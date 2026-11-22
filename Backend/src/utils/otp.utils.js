import crypto from "crypto";
import config from "../config/config.js";



export const generateOTP=()=>{
    return crypto.randomInt(100000,1000000).toString();
}

export const hashOTP=(otp,userId)=>{
    return crypto.createHmac("sha256",config.OTP_SECRET)
    .update(`${userId}:${otp}`)
    .digest("hex")
};

export const safeEqual=(a,b)=>{
    const x=Buffer.from(String(a));
    const y=Buffer.from(String(b));
    return x.length===y.length&&crypto.timingSafeEqual(x,y);
}


