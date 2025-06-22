// index.js

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

// const app = express();

// Load environment variables from .env file
dotenv.config();

// ✅ 1. PORT fallback for safety
const PORT = process.env.PORT || 5001; // ✅ fallback

const __dirname = path.resolve();

// ✅ 2. Use JSON middleware correctly
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // Reflects the request origin
    credentials: true,
  })
);

// ✅ Use these BEFORE routes

// ✅ 4. Mount routes
console.log("Mounting /api/auth");
app.use("/api/auth", authRoutes);

// ✅ 5. Mount routes
console.log("Mounting /api/messages");
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ✅ 6. Start server
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  connectDB();
});


console.log("ALL Done");
