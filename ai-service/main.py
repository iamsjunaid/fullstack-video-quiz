from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import re
import whisper
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = whisper.load_model(
    "base"
)  # you can try "small", "medium", or "large" if your system can handle it


@app.post("/transcribe")
async def transcribe_video(file: UploadFile = File(...)):
    try:
        file_location = f"uploads/{file.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"[INFO] Saved file at: {file_location}")
        assert os.path.exists(file_location)

        result = model.transcribe(file_location, verbose=False)
        os.remove(file_location)

        # Bucket into 5-minute (300s) chunks
        segments = result.get("segments", [])
        chunks = []
        current_chunk = {"start": 0, "end": 0, "text": ""}
        max_duration = 300  # 5 minutes

        for seg in segments:
            if (
                current_chunk["end"]
                - current_chunk["start"]
                + (seg["end"] - seg["start"])
                <= max_duration
            ):
                current_chunk["end"] = seg["end"]
                current_chunk["text"] += " " + seg["text"]
            else:
                chunks.append(current_chunk)
                current_chunk = {
                    "start": seg["start"],
                    "end": seg["end"],
                    "text": seg["text"],
                }
        if current_chunk["text"]:
            chunks.append(current_chunk)

        return {"transcript": result["text"], "segments": chunks}

    except Exception as e:
        print("[ERROR]", str(e))
        return {"error": str(e)}


class SegmentInput(BaseModel):
    text: str


@app.post("/generate_mcqs")
async def generate_mcqs(data: SegmentInput):
    prompt = (
        "Generate 3 multiple-choice questions based on the following text.\n"
        "Each question must have exactly 4 options (A–D).\n"
        "Use the following format:\n"
        "**Question X:** Your question\n\n"
        "A. Option 1\nB. Option 2\nC. Option 3\nD. Option 4\n\n"
        "**Answer: <Letter>. <Text>**\n\n"
        f"Text:\n{data.text.strip()}\n"
    )

    try:
        result = subprocess.run(
            ["ollama", "run", "gemma:2b"],
            input=prompt.encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=300,
        )

        if result.returncode != 0:
            return {
                "error": result.stderr.decode("utf-8"),
                "raw_output": result.stdout.decode("utf-8"),
                "mcqs": [],
            }

        output = result.stdout.decode("utf-8")
        print("[RAW MCQ TEXT]\n", output)

        mcqs = []
        # Split questions by the "**Question X:**" marker
        question_blocks = re.split(r"\*\*Question\s*\d+:\*\*", output)

        for block in question_blocks[1:]:  # skip the first empty split
            lines = block.strip().splitlines()
            question_line = lines[0].strip()
            options = [
                re.sub(r"^[A-D]\.\s*", "", line).strip()
                for line in lines
                if re.match(r"^[A-D]\.", line.strip())
            ]

            answer_match = re.search(r"\*\*Answer:\s*([A-D])\.\s*(.+?)\*\*", block)
            if answer_match and len(options) == 4:
                answer_index = ord(answer_match.group(1).upper()) - ord("A")
                mcqs.append(
                    {
                        "question": question_line,
                        "options": options,
                        "answer": (
                            options[answer_index] if 0 <= answer_index < 4 else None
                        ),
                    }
                )

        return {"raw_output": output, "mcqs": mcqs}

    except Exception as e:
        return {"error": str(e), "raw_output": "", "mcqs": []}
