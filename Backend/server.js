import app from "./src/app.js"
import ConnectDB from "./src/config/db.js";

const PORT =process.env.PORT||3000
try{
    await ConnectDB();
    app.listen(PORT,()=>{
        console.log(`app is running on port ${PORT}`)
    })
}catch(err){
    console.error("failed to start server",err);
    process.exit(1);
}