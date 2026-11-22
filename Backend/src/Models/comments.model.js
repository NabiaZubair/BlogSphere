import mongoose from 'mongoose'
import { maxLength } from 'zod'

const CommentsSchema= new mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true,
        maxLength:1000,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    posts:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts",
        required:true,
    }
},
{timestamps:true}
)

// loads the comments of one post, newest first, without scanning everything
CommentsSchema.index({ post: 1, createdAt: -1 });
const CommentsModel=  mongoose.model("Comments",CommentsSchema)

export default CommentsModel