import mongoose from "mongoose";

const passwordResetMongooseSchema= new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
            index:true,
        },
        otpHash:{
            type:String,
            required:true,
        },
        expiresAt:{
            type:Date,
            required:true,
        },
        attemptes:{
            type:Number,
            default:0,
        },
        usedAt:{
            type:Date,
            default:null,
        },
        resetTokenHash:{
            type:String,
            default:null,
            index:true,
        },
        resetTokenExpiresAt:{
            type:Date,
            default:null,
        }
    },
    {timestamps:true}
)

// delete every record 1 hour after it was created (covers OTP + reset token)
passwordResetMongooseSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const passwordResetToken= mongoose.model("passwordResetToken",passwordResetMongooseSchema)

export default passwordResetToken