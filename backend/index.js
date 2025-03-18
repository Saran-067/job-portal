import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET, // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // Your MongoDB connection string
        collectionName: "sessions"
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure cookies in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

const PORT = process.env.PORT ;

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Start server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
