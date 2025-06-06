import os
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # Read file content
    audio_bytes = await file.read()

    # Send to ElevenLabs API
    response = requests.post(
        url="https://api.elevenlabs.io/v1/speech-to-text",
        headers={"xi-api-key": ELEVENLABS_API_KEY},
        files={"file": (file.filename, audio_bytes, file.content_type)},
        data={
            "model_id": "scribe_v1",
            "diarize": "true",
            "language_code": "en",
            "tag_audio_events": "true"
        }
    )

    if response.ok:
        return JSONResponse(content=response.json())
    else:
        return JSONResponse(
            status_code=response.status_code,
            content={"error": response.text}
        )