import { useState, useCallback } from "react";

export const useScreenRecorder = (options) => {
  const { video = true, audio = true } = options;
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video,
        audio,
      });
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // @ts-ignore
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting media recording: ", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorder?.stop();
    mediaStream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    // Create a temporary link element and trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "recorded-video.webm"; // You can give any name to the file
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Optionally, free up the blob URL memory
    // URL.revokeObjectURL(url);
  }, [mediaRecorder, mediaStream, recordedChunks]);

  const getScreenRecording = useCallback(() => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    return URL.createObjectURL(blob);
  }, [recordedChunks]);

  return {
    startRecording,
    stopRecording,
    getScreenRecording,
    isRecording,
  };
};
