import React from "react";

interface SegmentCardProps {
    start: number;
    end: number;
    text: string;
    mcqs: {
        question: string;
        options: string[];
        answer: string;
    }[];
}


const SegmentCard: React.FC<SegmentCardProps> = ({ start, end, text, mcqs }) => {
    return (
        <div className="border rounded p-4 mb-4 shadow-sm bg-white">
            <p className="text-sm text-gray-500 mb-2">🕒 {start.toFixed(1)}s – {end.toFixed(1)}s</p>
            <p className="text-sm italic text-gray-700 mb-2">Transcript:</p>
            <p className="text-base mb-4">{text}</p>

            <p className="text-sm italic text-gray-700 mb-2">MCQs:</p>
            <div className="space-y-4">
                {mcqs.map((mcq, i) => (
                    <div key={i} className="bg-gray-100 p-3 rounded text-sm">
                        <p className="font-medium mb-1">Q{i + 1}: {mcq.question}</p>
                        <ul className="list-disc list-inside ml-4 mb-1">
                            {mcq.options.map((option, j) => (
                                <li key={j} className={option === mcq.answer ? "font-semibold text-green-600" : ""}>
                                    {option}
                                </li>
                            ))}
                        </ul>
                        <p className="text-xs text-gray-500">Answer: <span className="font-semibold">{mcq.answer}</span></p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SegmentCard;
