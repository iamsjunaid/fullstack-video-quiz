import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import uploadRouter from "./routes/upload";
import path from 'path';

// Load .env from the root directory before anything else
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRouter);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: unknown) => console.error("MongoDB connection error:", err));
