# AI-Powered Lecture Transcriber & MCQ Generator

A full-stack MERN application that enables users to upload lecture videos (MP4), transcribe them using Whisper, and generate Multiple Choice Questions (MCQs) for each 5-minute segment using AI.

## Features

- 🎬 Upload lecture videos via drag-and-drop
- 📜 Automatic transcription using Whisper
- 🧠 AI-generated MCQs for each 5-minute segment
- 📊 Clean, segment-wise UI display
- 💾 MongoDB Atlas for storing video metadata and results

## Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, React Query
- **Backend**: Node.js, Express.js, MongoDB Atlas
- **AI Service**: Python (Flask or FastAPI), Whisper, Local LLM (e.g., GPT4All, LLaMA, Mistral, Gemma:2b)
- **Deployment**: Dockerized for local or cloud environments

## Project Structure

```
root/
│
├── client/          # React + TypeScript frontend
├── server/          # Express.js + MongoDB backend
├── ai-service/      # Python microservice for transcription and MCQ generation
├── uploads/         # Temporary storage for uploaded videos
├── .env             # Environment variables
└── docker-compose.yml
```

## Getting Started

### Prerequisites

1. Node.js (v16 or higher)
2. Python (v3.8 or higher)
3. Docker (optional, for containerized deployment)
4. MongoDB Atlas account
5. Ollama (v0.7.1 or higher)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/iamsjunaid/lecture-ai-transcriber.git
   cd lecture-ai-transcriber
   ```

2. **Set Up Environment Variables**  
   Create a `.env` file in the project root with:

   ```
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   PORT=5000
   ```

   Ensure the server reads the `.env` file using:

   ```javascript
   dotenv.config({ path: path.resolve(__dirname, "../.env") });
   ```

3. **Set Up the AI Service with Gemma:2b**  
   The AI service uses Gemma:2b via Ollama for MCQ generation. Follow these steps:
   ```bash
   # Ensure Ollama is installed and running
   ollama pull gemma:2b
   cd ai-service
   pip install -r requirements.txt
   ```
   Ensure `requirements.txt` includes:
   ```
   flask==2.0.1
   fastapi==0.68.0
   whisper
   ollama
   ```
   Verify Gemma:2b is pulled by running:
   ```bash
   ollama list
   ```

### Running with Docker (Recommended)

```bash
docker-compose up --build
```

This starts:

- Frontend at http://localhost:3000
- Backend at http://localhost:5000
- AI microservice (if configured)

### Running Locally (Without Docker)

1. **Start the Backend**

   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the Frontend**

   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Start the AI Service**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   python app.py
   ```
   If you want to test it locally without Docker
   ```bash
   cd ai-service
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Endpoints

- `POST /api/upload`: Uploads a video and processes transcription + MCQ generation

## To-Do

- [ ] Implement user authentication
- [ ] Add pagination for long video segments
- [ ] Enable MCQ export as PDF or JSON
- [ ] Build an admin dashboard for review

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please submit issues or pull requests via GitHub.
