import dotenv from "dotenv"

dotenv.config();

if(!process.env.MONGO_URI){
    throw new ("mongo uri is not defined in  enviromental variable")
}



const config={
    MONGO_URI: process.env.MONGO_URI,
    ACCESS:process.env.ACCESS_JWT_SECRET,
    REFRESH:process.env.REFRESH_JWT_SECRET,
    NODE_ENV:process.env.NODE_ENV,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN,
    GMAIL_USER:process.env.GMAIL_USER,
    OTP_SECRET:process.env.OTP_SECRET,
    GOOGLE_ID:process.env.GOOGLE_ID

   
}

export default config