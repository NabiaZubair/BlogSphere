import express from "express";
import morgan from "morgan";
import cookieParser  from "cookie-parser";
import cors from "cors"
import helmet from "helmet"
import authRoutes from "../src/routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import { errorHandler,notFound } from "./middleware/errorHandler.middleware.js";
import categoryRoutes from "./routes/category.routes.js"

const app=express();

if(process.env.NODE_ENV==="production"){
    app.set("trust proxy",1)
}

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL||"http://localhost:5173",
    credentials:true
}))


app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


app.get("/api/health",(req,res)=>res.json({status:"ok"}));


app.use("/api/auth", authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/categories",categoryRoutes);
app.use(notFound);
app.use(errorHandler);


export default app;