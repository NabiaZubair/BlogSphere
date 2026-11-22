import jwt from "jsonwebtoken";
import config from "../config/config.js"
import userModel from "../models/user.model.js";


const optionalAuth=async (req,res,next)=>{
    try{
        const [scheme,token]=(req.header.authorizaton||"").split("")
   if(scheme==="bearer"&&token){
    const decoded=jwt.verify(token,config.ACCESS);
    req.user=await userModel.findById(decoded.id).select("-password");
    
    }
    next();


}catch(err){
    if(err.name==="TokenExpiredError"){
        return res.status(401).json({message:"token expired",code:"TOKEN_EXPIRED"})
    }
    if(err instanceof jwt.JsonWebTokenError){
        return next();
    }
    next(err);
    
}
}
export default optionalAuth;