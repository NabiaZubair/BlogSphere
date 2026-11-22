import jwt from "jsonwebtoken"
import config from "../config/config.js";
import userModel from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {

    try {
        

        const [schema,token] =( req.headers.authorization||"").split(" ");

        if (schema !=="Bearer"||!token) {
            return res.status(401).json({ message: "unothorized" })
        }

        const decoded = jwt.verify(token, config.ACCESS);
        const user= await userModel.findById(decoded.id).select("-password")

        if(!user){
            return res.status(401).json({
                message:"user not found"
            });
        }

        req.user = user;

        next();

    } catch (err) {
 
         // only token problems are 401. TokenExpiredError is a kind of JsonWebTokenError.
        if (err instanceof jwt.JsonWebTokenError) {
            const expired = err.name === "TokenExpiredError";
            return res.status(401).json({
                message: expired ? "token expired" : "invalid token",
                // your Axios interceptor refreshes the token when it sees TOKEN_EXPIRED
                code: expired ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
            });
        }

        // anything else (database down, bug) is a real server error
        next(err);
    }
}

export default authMiddleware;