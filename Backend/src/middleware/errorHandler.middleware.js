import multer from "multer";
import mongoose from "mongoose";
export const notFound=(req,res)=>{
    res.status(404).json({message:"route not found"})
}

export const errorHandler=(err,req,res,next)=>{
    if(res.headersSent) return next(err);

    if(err instanceof multer.MulterError){
        const message=err.code==="LIMIT_FILE_SIZE"?"image must be under 5 mb":err.code==="LIMIT_UNEXPECTED_FILE"?"unexpected file field":err.message
    return res.status(400).json({message});
    }

      // schema rules broken (e.g. missing title)
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: "validation failed", errors });
    }

    // bad ObjectId or wrong type
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: `invalid ${err.path}` });
    }

    // unique index violated (duplicate email, slug...)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || "value";
        return res.status(409).json({ message: `${field} already exists` });
    }

    console.error(err);
    
    const status=err.status||500;
    res.status(status).json({
        message:status===500?"something went wrong " :err.message,    })
}