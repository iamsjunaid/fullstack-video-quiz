import React, { useState } from "react";
import axios from "axios";
import TranscriptViewer from "./TranscriptViewer";

const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [transcript, setTranscript] = useState<string>("");
    const [segments, setSegments] = useState<any[]>([]);
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
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
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    setProgress(percent);
                }
            });

            setTranscript(res.data.video.transcript);
            console.log("Segments with MCQs:", res.data.video.segments);
            setSegments(res.data.video.segments);

            setMessage("✅ MCQs generated successfully!");
        } catch (err) {
            setMessage("❌ Upload failed.");
            console.error(err);
        }
    };

    return (
        <div className="space-y-4">
            <input type="file" accept="video/mp4" onChange={handleFileChange} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleUpload} disabled={!file}>
                Upload
            </button>
            {progress > 0 && <div>Progress: {progress}%</div>}
            {message && <p>{message}</p>}

            {transcript && Array.isArray(segments) && segments.length > 0 && (
                <TranscriptViewer transcript={transcript} segments={segments} />
            )}
        </div>
    );
};

export default UploadForm;
