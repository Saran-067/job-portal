import cors from 'cors';
import express from 'express';
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Allows session cookies
}));
