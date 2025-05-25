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
            {segments.map((segment, idx) => (
                <SegmentCard key={idx} {...segment} />
            ))}
        </div>
    );
};

export default TranscriptViewer;
