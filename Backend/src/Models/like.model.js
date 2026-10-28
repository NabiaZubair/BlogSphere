import mongoose from "mongoose";

const LikeSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts",
        required:true
    }
},
{
    timestamps:true
})

LikeSchema.index({ user: 1, post: 1 }, { unique: true });

const LikeModel= mongoose.model("Like",LikeSchema)

export default LikeModel