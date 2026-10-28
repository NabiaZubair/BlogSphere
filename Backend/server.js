import app from "./src/app.js"
import ConnectDB from "./src/config/db.js";

ConnectDB()

app.listen(3000,()=>{
console.log("app is runngin on port 300");
})