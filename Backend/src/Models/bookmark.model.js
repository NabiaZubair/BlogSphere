import mongoose, { mongo } from "mongoose";

const BookmarkSchema= new mongoose.Schema({
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

BookmarkSchema.index({ user: 1, post: 1 }, { unique: true });

const BookmarModel= mongoose.model("Bookmark",BookmarkSchema)

export default BookmarModel