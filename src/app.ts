import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import allRoutes from "./routes";

// Enable .env
dotenv.config();

// Initalize express app
const app: Express = express();

// Global middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.SITE_URL as string,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// allRoutes
allRoutes(app);

export default app;
