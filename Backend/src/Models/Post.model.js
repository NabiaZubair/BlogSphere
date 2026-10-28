import mongoose from "mongoose";

const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true

    },
    content: {
        type: String,
        required: true

    },
    coverImage: {
        url:{type:String},
        publicId:{type:String},

    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true

    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true

    },
    tags: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ["published", "draft"],
        default: "draft"

    }
},
    {
        timestamps: true

    })

const PostModel = mongoose.model("Posts", PostsSchema)

export default PostModel