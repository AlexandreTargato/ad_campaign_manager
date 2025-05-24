import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDatabase } from "./database/connection";
import campaignRoutes from "./routes/campaigns";
import adsetRoutes from "./routes/adsets";
import adRoutes from "./routes/ads";
import chatRoutes from "./routes/chat";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/adsets", adsetRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/chat", chatRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
