import mongoose from "mongoose";
import config from "./config.js";

const ConnectDB=async()=>{

    try{
        mongoose.connect(config.MONGO_URI)
 console.log("mongoDb connected")
    }catch(error){
        console.log("mongoDb connection failed:", error.message)
process.exit(1)
    }

}
export default ConnectDB