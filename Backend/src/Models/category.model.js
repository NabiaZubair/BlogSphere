import mongoose from "mongoose";

const CategorySchema= new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    slug:{
         type:String,
        unique:true,
        required:true,
        trim:true

    }
},
    {timestamps:true}
)

const CategoryModel= mongoose.model("Category",CategorySchema)

export default CategoryModel