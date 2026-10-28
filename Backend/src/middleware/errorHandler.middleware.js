import multer from "multer";

export const errorHandler=(err,req,res,next)=>{
    if(err instanceof multer.MulterError){
        const message=err.code==="LIMIT_FILE_SIZE"?"image must be under 5 mb":err.message
    return res.status(400).json({message});
    }

    console.error(err);
    
    const status=err.status||500;
    res.status(status).json({
        message:status===500?"something went wrong " :err.message,    })
}