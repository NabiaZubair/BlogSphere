import CategoryModel from "../Models/category.model.js";

export const createCategory = async (req, res, next) => {
    try {
        const { name, slug } = req.body;
        if(!name?.trim() || !slug?.trim()){
            return res.status(400).json({
                message: "category name and slug are required"
            })
        }
        const category = await CategoryModel.create({
            name: name.trim(),
            slug: slug.trim().toLowerCase(),
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
        const categories = await CategoryModel.find()
            .sort({ name: 1 });
        return res.status(200).json(categories);
    } catch (error) {
        next(error)
    }
}