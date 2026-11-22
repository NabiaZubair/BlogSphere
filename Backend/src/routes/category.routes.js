import express from "express";
import { createCategory,getCategories } from "../controllers/category.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {requireAdmin} from "../middleware/admin.middleware.js"

const router=express.Router();

router.post("/",authMiddleware,requireAdmin,createCategory);
router.get("/",getCategories);

export default router;