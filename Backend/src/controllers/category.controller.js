import CategoryModel from "../models/category.model.js";
import slugify from "slugify";



export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        if(typeof name !=="string" || !name.trim()){
            return res.status(400).json({
                message: "category name is required"
            })
        }
        const cleanName=name.trim();
        const slug = slugify(cleanName,{lower:true,strict:true});

        if(!slug){
            return res.status(400).json({
                message:"category name must conain letter or numbers"
            })
        }
        const category = await CategoryModel.create({
            name: cleanName,
            slug,
        })
        return res.status(201).json({
            message: "category created successfully",
            category,
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "category name or slug already exist"
            })
        }
        next(error);
    }
}

export const getCategories = async (req, res, next) => {
    try {
        const categories = await (await CategoryModel.find()).toSorted({name:1});
        
        return res.status(200).json(categories);
    } catch (error) {
        next(error)
    }
}