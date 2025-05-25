import React, { useState } from "react";
import axios from "axios";
import TranscriptViewer from "./TranscriptViewer";

type Segment = {
    start: number;
    end: number;
    text: string;
    // Add more fields if your segment object contains more properties
};

const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [transcript, setTranscript] = useState<string>("");
    const [segments, setSegments] = useState<Segment[]>([]);
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setMessage("");
            setProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("video", file);

        try {
            setMessage("Uploading and processing...");
            setTranscript("");
            setSegments([]);
            setProgress(0);

            const res = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / (event.total || 1));
                    setProgress(percent);
                },
            });

            setTranscript(res.data.video.transcript);
            setSegments(res.data.video.segments);
            setMessage("✅ MCQs generated successfully!");
        } catch (err) {
            setMessage("❌ Upload failed.");
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                <input
                    id="file-upload"
                    type="file"
                    accept="video/mp4"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:underline">
                    {file ? `📹 Selected: ${file.name}` : "Click to select a lecture video (MP4)"}
                </label>
            </div>

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={!file}
                className={`px-6 py-2 rounded text-white font-medium transition ${file ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                    }`}
            >
                Upload & Generate MCQs
            </button>

            {/* Progress Bar */}
            {progress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                        className="bg-blue-500 h-4 transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Status Message */}
            {message && (
                <p
                    className={`text-sm ${message.includes("✅")
                            ? "text-green-600"
                            : message.includes("❌")
                                ? "text-red-600"
                                : "text-gray-600"
                        }`}
                >
                    {message}
                </p>
            )}

            {/* Transcript Viewer */}
            {transcript && Array.isArray(segments) && segments.length > 0 && (
                <TranscriptViewer transcript={transcript} segments={segments} />
            )}
        </div>
    );
};

export default UploadForm;
