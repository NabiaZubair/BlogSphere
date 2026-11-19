import mongoose from "mongoose";
import PostModel from "../Models/Post.model.js";
import { deleteImage, uploadImage } from "../services/cloudinary.service.js";

// small helpers so errors carry the right status code
const httpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};


const parseTags = (tags) => {
    if (tags === undefined || tags === "") return [];

    let parsed = tags;

    if (typeof tags === "string") {
        try {
            parsed = JSON.parse(tags)

        } catch {
            throw httpError(400, "Tags must be a json array")
        }
    }

    if (!Array.isArray(parsed) || !parsed.every((tag) => typeof tag === "string")) {
        throw httpError(400, "Tags must be an array of strings");
    }

    return [...new Set(
        parsed.map((tag) => tag.trim().toLowerCase()).filter(Boolean)
    )].slice(0, 3);
}

export const createPost = async (req, res, next) => {
    let uploaded;
    try {

        const { title, content, tags, category, status } = req.body;
        const parsedTags = parseTags(tags);

        if (req.file) {
            uploaded = await uploadImage(req.file.buffer);
        }

        const post = await PostModel.create({
            title,
            content,
            tags: parsedTags,
            category,
            status,
            author: req.user._id,
            coverImage: uploaded,
        })
        console.log(author);

        res.status(201).json(post)
    } catch (error) {
        if (uploaded) {
            await deleteImage(uploaded.publicId)
        }
        next(error)
    }
}

export const getPosts = async (req, res, next) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

        const filter = { status: "published" };
        const [posts, total] = await Promise.all([
            PostModel.find(filter).
                populate("author", "username").
                populate("category", "name").
                sort({ createdAt: -1 }).
                skip((page - 1) * limit).
                limit(limit),
            PostModel.countDocuments(filter),
        ])

        res.json({ posts, page, totalPages: Math.ceil(total / limit), total })
    } catch (error) {
        next(error);

    }
}


export const getMyPost = async (req, res, next) => {
    try {
        const posts = await PostModel.find({ author: req.user._id }).sort({
            createdAt: -1
        })
        res.json(posts)

    } catch (error) {
        next(error)

    }
}

export const getPostById = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "invalid post id " })
        }
        const post = await PostModel.findOne({
            _id: req.params.id,
            status: "published",
        })
            .populate("author", "username")
            .populate("category", "name");
        if (!post) {
            return res.status(404).json({ message: "post not found " })

        }
        res.json(post)
    } catch (error) {

        next(error)
    }
}
export const updatePost = async (req, res, next) => {
    let uploaded;
    try {

        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(401).json({ message: "invalid Post Id" });

        const post = await PostModel.findById(req.params.id);

        if (!post) {
            throw httpError(404, "post not found");
        }

        if (post.author.toString() !== req.user._id.toString()) {
            throw httpError(403, "not allowed")
        }



        const { title, content, category, tags, status } = req.body;
        if (title !== undefined) post.title = title;
        if (content !== undefined) post.content = content;
        if (category !== undefined) post.category = category;
        if (tags !== undefined) post.tags = parseTags(tags);
        if (status !== undefined) post.status = status;



        const oldPublicId = post.coverImage?.publicId;

        if (req.file) {
            uploaded = await uploadImage(req.file.buffer);
            post.coverImage = uploaded;
        }
        await post.save();

        if (uploaded && oldPublicId) {
            try {
                await deleteImage(oldPublicId)
            } catch (cleanupError) {
                console.error("old image cleanup failed".cleanupError)
            }
        }

        res.json(post)

    } catch (error) {
        if (uploaded) {
            await deleteImage(uploaded.publicId);
        }
        next(error)
    }
}

export const deletePost = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            throw httpError(400, "invalid post id" )
        }
        const post = await PostModel.findById(req.params.id);

        if (!post) {
             throw httpError(404,"post not found" )
             }

        if (post.author.toString() !== req.user._id.toString()) {
            throw httpError(403).json({ message: "not allowed" })
        }

        await post.deleteOne();
        await deleteImage(post.coverImage?.publicId);
        res.json({ message: "post deleted" })
    } catch (error) {
        next(error)
    }
}


