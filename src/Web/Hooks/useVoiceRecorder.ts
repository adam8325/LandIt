import { useRef, useState } from "react";

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm"
    });

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = []; 

    mediaRecorder.start();
    setIsRecording(true);
  }

  async function stopRecording(): Promise<File> {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) return;

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        chunksRef.current = [];
        setIsRecording(false);
        resolve(file);
      };

      mediaRecorderRef.current.stop();
    });
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
