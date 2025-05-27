FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y git ffmpeg && apt-get clean

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose the port if needed
EXPOSE 8000

# Command to run your app (adjust based on FastAPI or Flask)
CMD ["python", "main.py"]
