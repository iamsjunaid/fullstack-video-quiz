import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

import { Request, Response } from "express";

router.post("/", upload.single("video"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  // Placeholder: call transcription service next
  res
    .status(200)
    .json({ message: "Video uploaded.", filename: req.file.filename });
});

export default router;
