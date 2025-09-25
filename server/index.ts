import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import aiRoutes from "./routes/ai";
import authRoutes from "./routes/auth";
import { getCounselors } from "./routes/counselors.ts";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://mystic-forge-iqmmq3jsl-vinit-kalambes-projects.vercel.app',
      'https://*.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get("/api/ping", (_req, res) => {
    res.json({ 
      message: "SPEAK Backend is running",
      timestamp: new Date().toISOString(),
      status: "healthy",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development"
    });
  });

  app.get("/api/demo", handleDemo);
  
  // AI routes
  app.use("/api/ai", aiRoutes);
  
  // Authentication routes
  app.use("/api/auth", authRoutes);

  // Counselor routes
  app.get("/api/counselors", getCounselors);

  return app;
}
