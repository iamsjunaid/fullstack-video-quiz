import React from "react";
import SegmentCard from "./SegmentCard";

interface Segment {
    start: number;
    end: number;
    text: string;
    mcqs: {
        question: string;
        options: string[];
        answer: string;
    }[];

}

interface TranscriptViewerProps {
    transcript: string;
    segments: Segment[];
}

const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ transcript, segments }) => {
    console.log(transcript, segments);

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">📜 Full Transcript</h2>
            <p className="bg-gray-50 p-4 rounded text-sm mb-8 whitespace-pre-wrap">{transcript}</p>

            <h2 className="text-xl font-bold mb-4">🧩 Segmented MCQs</h2>
            {segments.map((segment, idx) => (
                <SegmentCard key={idx} {...segment} />
            ))}
        </div>
    );
};

export default TranscriptViewer;
