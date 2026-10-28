import mongoose from 'mongoose'

const CommentsSchema= new mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    posts:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts"
    }
},
{timestamps:true}
)

const CommentsModel= new mongoose.model("Comments",CommentsSchema)

export default CommentsModel