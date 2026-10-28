import express from "express";
import morgan from "morgan";
import cookieParser  from "cookie-parser";
import cors from "cors"
import authRoutes from "../src/routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import categoryRoutes from "./routes/category.routes.js"

const app=express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/categories",categoryRoutes);
app.use(errorHandler);


export default app;