/**
 * Camera rendering page.
 * Users are able to take a picture with their basic device camera feature or
 * Users are able to pull up their gallery
 * 
 * 
 * TODO:
 * Connect with database
 * Test with backend
 * Find the best file image size
 * Fetch openAI 
 */
import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Processing from "./Processing";
import { useNavigate } from "react-router-dom";
import { Languages } from "lucide-react";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  RotateCcw,
  Loader2,
  Check,
  Trash2,
  Video,
} from "lucide-react";
import languages from "../../../data/langauges.json"

interface Picture {
  picturePreview: string;
  pictureAsFile: File;
}

export default function CameraPage() {
  const [picture, setPicture] = useState<Picture | null>(null);
  const [camera, setCamera] = useState(false);
  const [pendingStream, setPendingStream] = useState<MediaStream | null>(null);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [targetLang, setTargetLang] = useState<string>("fr"); 
  
  // Attach stream to video when ready
  useEffect(() => {
    if (camera && pendingStream && videoRef.current) {
      videoRef.current.srcObject = pendingStream;
      streamRef.current = pendingStream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
        setStarting(false);
      };
    }
  }, [camera, pendingStream]);

  // Cleanup on unmount
  useEffect(() => {
    request_info()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startCamera = async () => {
    setErrorMsg(null);
    setStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setPendingStream(stream);
      setCamera(true);
    } catch (error) {
      console.error("Error accessing camera", error);
      setErrorMsg("Unable to access camera. Please allow camera permission.");
      setStarting(false);
      setCamera(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCamera(false);
    setPendingStream(null);
    setStarting(false);
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "captured_image.png", { type: "image/png" });
      const preview = URL.createObjectURL(blob);
      setPicture({ picturePreview: preview, pictureAsFile: file });
      stopCamera();
    }, "image/png");
  };

  const uploadPicture = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPicture({
        picturePreview: URL.createObjectURL(e.target.files[0]),
        pictureAsFile: e.target.files[0],
      });
    }
  };

  const clearImage = () => {
    setPicture(null);
    if (inputRef.current) inputRef.current.value = "";
    console.log("Clear image")
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    console.log("Clicked!")
    e.preventDefault();
    if (!picture) return;

    const formData = new FormData();
    formData.append("file", picture.pictureAsFile);
    const selectedLabel = languages.find(lang => lang.code === targetLang)?.label;
    if (selectedLabel) {
      formData.append("target_lang", selectedLabel);
    }
    formData.append("target_lang_code", targetLang)

    setUploadDisabled(true);
    setProcessing(true);

    try {
      const response = await fetch("http://localhost:8000/api/image-translate/", {
        method: "POST",
        body: formData,
        credentials: 'include'
      });

      if (response.status == 429) {
        const responseData = await response.json();
        setProcessing(false);
        alert(`${responseData.detail}. Retry after ${responseData.retry_after} seconds.`);
        return;
      }

      if(!response.ok) {
        const errorData = await response.json()
        console.error("Error uploading: ", errorData)
        setUploadDisabled(false);
        setProcessing(false);
        return;
      }

      const responseData = await response.json();

      const historyId = responseData.user_history_id;

      window.location.href = `/user/userhistory/${historyId}`

    } catch (error) {
      console.error("Upload failed", error);
      setErrorMsg("Upload failed. Please try again.");
      setUploadDisabled(false);
      setProcessing(false);
    }
  };

  if(processing) {
    return <Processing />
  }

  const request_info = async() => {
    const response = await fetch(import.meta.env.VITE_SERVER_URL + "/get_user_info", {
        credentials: 'include',
      }
    )
    .then(function(response) { 
      if (response.status == 401) {
        window.location.href = "/login";
        return;
      }
      if (response.status == 429) {
        response.json().then(function(data) {
          alert(`${data.detail}. Retry after ${data.retry_after} seconds.`);
        });
        return;
      }

      return response.json();
    })
    .then(function(json) {
      // use the json
      let found = languages.find(({ code, label }) => 
        {
          return label == json.default_language
        }
      )
      // console.log(languages)
      // console.log(found)
      // console.log(json.default_language)
      if (found !== undefined){
        setTargetLang(found.code)
      }
    });
  }

  return (
    <div className="min-h-screen mx-auto w-full max-w-[1080px] bg-gradient-to-b from-indigo-50 via-white to-white py-8">
      <main className="mx-auto w-full max-w-md px-4">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow">
            <Camera size={18} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Camera & Image Translate</h1>
            <p className="text-sm text-gray-500">Snap a photo or upload from your library.</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white p-4 shadow-xl ring-1 ring-black/5">
          <form onSubmit={handleUpload} className="space-y-5">
            {/* Video / Preview area */}
            {camera ? (
              <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                <div className="aspect-video w-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Subtle overlay grid */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path d="M33.33 0v100M66.66 0v100M0 33.33h100M0 66.66h100" stroke="white" strokeWidth="0.5" />
                </svg>

                {/* Bottom controls */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <button
                    type="button"
                    onClick={takePhoto}
                    className="grid h-16 w-16 place-items-center rounded-full bg-white text-gray-900 shadow-lg transition active:scale-95"
                    aria-label="Take Photo"
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-900" />
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 shadow hover:bg-white"
                  >
                    <X className="mr-1 inline-block" size={16} />
                    Cancel
                  </button>
                </div>

                {/* Starting overlay */}
                {starting && (
                  <div className="absolute inset-0 grid place-items-center bg-black/50">
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium shadow">
                      <Loader2 className="animate-spin" size={16} />
                      Starting camera…
                    </div>
                  </div>
                )}
              </div>
            ) : picture?.picturePreview ? (
              <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200">
                <img
                  src={picture.picturePreview}
                  alt="Preview"
                  className="max-h-[420px] w-full object-contain bg-gray-50"
                />
              </div>
            ) : (
              // Upload dropzone
              <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white shadow">
                  <ImageIcon size={20} className="text-gray-600" />
                </div>
                <p className="text-sm text-gray-700">
                  Drag & drop an image here, or
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="ml-1 font-medium text-indigo-600 underline-offset-2 hover:underline"
                  >
                    browse your files
                  </button>
                  .
                </p>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG up to ~10MB</p>
              </div>
            )}

            {/* Hidden input for file select */}
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={uploadPicture}
              className="hidden"
            />

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {!camera && !picture && (
                <>
                  <button
                    onClick={() => inputRef.current?.click()}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow ring-1 ring-gray-200 hover:bg-gray-50"
                  >
                    <Upload size={16} />
                    Select Image
                  </button>
                  <button
                    onClick={startCamera}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
                  >
                    <Video size={16} />
                    Open Camera
                  </button>
                </>
              )}

              {picture && !camera && (
                <>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 disabled:opacity-50"
                    disabled={uploadDisabled}
                  >
                    <Check size={16} />
                    Upload
                  </button>
                  <button
                    onClick={startCamera}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow ring-1 ring-gray-200 hover:bg-gray-50"
                  >
                    <RotateCcw size={16} />
                    Retake
                  </button>
                  <button
                    onClick={() => inputRef.current?.click()}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow ring-1 ring-gray-200 hover:bg-gray-50"
                  >
                    <Upload size={16} />
                    Replace
                  </button>
                  <button
                    onClick={clearImage}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-red-600 shadow ring-1 ring-red-200 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Clear
                  </button>
                </>
              )}
            </div>

            {/* Choose a language translate to */}
            <div className="grid gap-2">
                <label htmlFor="targetLang" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Languages size={16} />
                  Translate to
                </label>
                <select
                  id="targetLang"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {languages.map(({ code, label }) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">Choose the output language for the translation.</p>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
                {errorMsg}
              </div>
            )}
          </form>
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Tip: Good lighting improves OCR accuracy for translations.
        </p>
      </main>
    </div>
  );
}
