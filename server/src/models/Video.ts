import mongoose from "mongoose";

const MCQSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
});

const SegmentSchema = new mongoose.Schema({
  start: Number,
  end: Number,
  text: String,
  mcqs: [MCQSchema], // ← expects array of structured MCQs
});

const VideoSchema = new mongoose.Schema({
  originalName: String,
  mimeType: String,
  size: Number,
  path: String,
  uploadDate: Date,
  transcript: String,
  segments: [SegmentSchema], // ← each segment has text + mcqs
});

export default mongoose.model("Video", VideoSchema);
