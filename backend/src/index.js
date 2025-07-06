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
const port = parseInt(process.env.PORT, 10) || 5001;   // ✅ fallback

const __dirname = path.resolve();

// ✅ 2. Use JSON middleware correctly
app.use(express.json());
app.use(cookieParser());



const allowedOrigins = [
  "http://localhost:5001", // local dev
  "https://talksy-chat-app.netlify.app", // production
  "https://talksy-chat-app-one.vercel.app/",
  "https://ideal-bassoon-977r6p5946gpc7rxj-5173.app.github.dev/login" // optional more
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}

// ✅ 6. Start server
server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
  connectDB();
});



