import React from "react";
import UploadForm from "../components/UploadForm";

const Home: React.FC = () => {
    return (
        <div className="p-10 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Upload Lecture Video</h1>
            <UploadForm />
        </div>
    );
};

export default Home;
