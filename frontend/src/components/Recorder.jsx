import React, { useState, useRef } from "react";
import axios from "axios";

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setTranscript("");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
 
      // Send to FastAPI backend
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      try {
        const res = await axios.post(
          "http://localhost:8000/transcribe",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setTranscript(res.data?.text || JSON.stringify(res.data, null, 2));
      } catch (err) {
        console.error("Error uploading:", err);
        setTranscript("Error uploading audio.");
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="text-center p-6 space-y-4">
      <h2 className="text-xl font-bold">🎙️ VoicePlanr Demo</h2>
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded ${
          recording ? "bg-red-600" : "bg-green-600"
        } text-white`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioURL && (
        <div>
          <p className="mt-4 font-medium">▶️ Preview:</p>
          <audio src={audioURL} controls />
        </div>
      )}

      {transcript && (
        <div className="mt-4 text-left">
          <h4 className="font-semibold">📝 Transcript:</h4>
          <pre className="bg-gray-900 text-white p-2 rounded">{transcript}</pre>
        </div>
      )}
    </div>
  );
};

export default Recorder;
