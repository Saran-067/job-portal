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

app.set("trust proxy", 1); // Trust proxies to handle cookies correctly

const corsOptions = {
    origin: 'https://job-portal-nine-psi.vercel.app',  
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// app.use(cors(corsOptions));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
        ttl: 24 * 60 * 60, // 1 day expiry
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
        sameSite: "none", // Required for cross-origin sessions
        maxAge: 24 * 60 * 60 * 1000, // 1 day
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
