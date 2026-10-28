import express from "express"
import{createPost ,getPosts,getMyPost,getPostById,updatePost,deletePost} from "../controllers/post.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/uplaod.middleware.js";


const postRoutes=express.Router();

//public
postRoutes.get("/",getPosts);
//loggec in 
postRoutes.get("/my",authMiddleware,getMyPost);
//public
postRoutes.get("/:id",getPostById);
//logged in
postRoutes.post("/",authMiddleware,upload.single("coverImage"),createPost)
postRoutes.put("/:id",authMiddleware,upload.single("coverImage"),updatePost)
postRoutes.delete("/:id",authMiddleware,deletePost)

export default postRoutes