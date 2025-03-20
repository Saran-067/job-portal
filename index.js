import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./backend/utils/db.js";
import userRoute from "./backend/routes/user.route.js";
import companyRoute from "./backend/routes/company.route.js";
import jobRoute from "./backend/routes/job.route.js";
import applicationRoute from "./backend/routes/application.route.js";
import path from "path";
import nodemon from "nodemon";
dotenv.config({});

const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend", "dist")));
// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})