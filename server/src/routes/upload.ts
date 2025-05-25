import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import Video from "../models/Video";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("video"), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  const filePath = path.join(__dirname, "../../uploads", req.file.filename);

  try {
    // Step 1: Transcribe video
    const fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append("file", fileStream, {
      filename: req.file.filename,
      contentType: req.file.mimetype,
    });

    const transcribeResponse = await axios.post(
      "http://localhost:8000/transcribe",
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
      }
    );

    const { transcript, segments } = transcribeResponse.data;

    if (!segments || !Array.isArray(segments)) {
      console.warn("🚨 No segments received");
      res.status(500).json({ error: "No segments received" });
      return;
    }

    // Step 2: Generate MCQs for each segment
    const enrichedSegments = [];

    for (const segment of segments) {
      const mcqRes = await axios.post("http://localhost:8000/generate_mcqs", {
        text: segment.text,
      });

      enrichedSegments.push({
        start: segment.start,
        end: segment.end,
        text: segment.text,
        mcqs: mcqRes.data.mcqs || [],
      });
    }

    console.log("Segments with MCQs:", enrichedSegments); // ✅ Should now log valid array

    // Step 3: Save to MongoDB
    const fullVideo = new Video({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadDate: new Date(),
      transcript,
      segments: enrichedSegments,
    });

    await fullVideo.save();

    res.json({
      message: "Video uploaded and processed successfully",
      video: fullVideo,
    });

    fs.unlinkSync(filePath); // Clean up
  } catch (err: any) {
    console.error("❌ Error processing video:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to process video" });
  }
});

export default router;
