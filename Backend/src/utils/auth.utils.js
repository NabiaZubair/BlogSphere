import jwt from "jsonwebtoken"
import crypto from "crypto"
import config from "../config/config.js";

const ACCESS_TOKEN_EXPIRES="15m";
const REFRESH_TOKEN_EXPIRES="7d";
const REFRESH_TOKEN_MAX_AGE=7*24*60*60*1000;

const accessToken=(userId)=>{
    return jwt.sign({
        id:userId
    },config.ACCESS,
    {
        expiresIn:ACCESS_TOKEN_EXPIRES
    }
);
};

const refreshToken=(userId)=>{
    return jwt.sign({                                  
        id:userId
    },config.REFRESH,      
    {
        expiresIn:REFRESH_TOKEN_EXPIRES,
        jwtid:crypto.randomUUID(),
    });
};

const hashtoken=(token)=>{
    return crypto.createHash("sha256").update(token).digest("hex")
}
const isProd=config.NODE_ENV==="production";

const cookieBase={
    httpOnly:true,
    secure:isProd,
    sameSite:isProd?"none":"lax",
    path:"/api/auth",
}
const refreshCookieOptions={...cookieBase,maxAge:REFRESH_TOKEN_MAX_AGE};
const clearCookieOptions=cookieBase;

const setRefreshToken=(res,token)=>{
    res.cookie("refreshToken",token,refreshCookieOptions)
  
};

export {accessToken,refreshToken,hashtoken,setRefreshToken,
    clearCookieOptions,
    REFRESH_TOKEN_MAX_AGE
};