/**
 * Camera page for capturing or uploading an image and sending it for translation.
 */
import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Processing from "./Processing";
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
import languages from "../../../data/langauges.json";

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
  const [targetLang, setTargetLang] = useState<string>("en");

  // DOM refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Attach camera stream to video when camera is enabled
  useEffect(() => {
    if (camera && pendingStream && videoRef.current) {
      try {
        videoRef.current.srcObject = pendingStream;
        streamRef.current = pendingStream;

        videoRef.current.onloadedmetadata = () => {
          try {
            videoRef.current?.play();
          } catch (err) {
            console.error("Error playing camera stream", err);
            setErrorMsg("Failed to start camera preview.");
          } finally {
            setStarting(false);
          }
        };
      } catch (err) {
        console.error("Error attaching camera stream", err);
        setErrorMsg("Failed to attach camera stream.");
        setStarting(false);
      }
    }
  }, [camera, pendingStream]);

  // Fetch user info on mount and clean up camera on unmount
  useEffect(() => {
    requestInfo();

    return () => {
      try {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      } catch (err) {
        console.error("Error cleaning up camera stream", err);
      }
    };
  }, []);

  // Start camera and request permission
  const startCamera = async () => {
    setErrorMsg(null);
    setStarting(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setPendingStream(stream);
      setCamera(true);
    } catch (error) {
      console.error("Error accessing camera", error);
      setErrorMsg(
        "Unable to access camera. Please allow camera permission or check your device."
      );
      setStarting(false);
      setCamera(false);
    }
  };

  // Stop camera and release stream
  const stopCamera = () => {
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("Error stopping camera", err);
    } finally {
      setCamera(false);
      setPendingStream(null);
      setStarting(false);
    }
  };

  // Capture a frame from the video as an image file
  const takePhoto = () => {
    try {
      if (!videoRef.current) return;
      const video = videoRef.current;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("2D canvas context not available.");
      }

      ctx.drawImage(video, 0, 0);
      canvas.toBlob(
        (blob) => {
          try {
            if (!blob) {
              throw new Error("Failed to create image blob.");
            }

            const file = new File([blob], "captured_image.png", {
              type: "image/png",
            });
            const preview = URL.createObjectURL(blob);

            setPicture({ picturePreview: preview, pictureAsFile: file });
            stopCamera();
          } catch (err) {
            console.error("Error handling captured photo", err);
            setErrorMsg("Failed to capture photo. Please try again.");
          }
        },
        "image/png"
      );
    } catch (err) {
      console.error("Error capturing photo", err);
      setErrorMsg("Failed to capture photo. Please try again.");
    }
  };

  // Handle file selection from device
  const uploadPicture = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);

        setPicture({
          picturePreview: preview,
          pictureAsFile: file,
        });
        setErrorMsg(null);
      }
    } catch (err) {
      console.error("Error loading image file", err);
      setErrorMsg("Failed to load image. Please try another file.");
    }
  };

  // Clear current image and reset input
  const clearImage = () => {
    try {
      if (picture?.picturePreview) {
        URL.revokeObjectURL(picture.picturePreview);
      }
      setPicture(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error("Error clearing image", err);
      setErrorMsg("Failed to clear image.");
    }
  };

  // Submit image to backend for translation
  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!picture) {
      setErrorMsg("Please select or capture an image first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", picture.pictureAsFile);

      // Find label for selected target language
      const selectedLabel = languages.find(
        (lang: { code: string; label: string }) => lang.code === targetLang
      )?.label;

      if (selectedLabel) {
        formData.append("target_lang", selectedLabel);
      }

      formData.append("target_lang_code", targetLang);

      setUploadDisabled(true);
      setProcessing(true);

      const response = await fetch(
        "http://localhost:8000/api/image-translate/",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error uploading: ", responseData);
        setUploadDisabled(false);
        setProcessing(false);
        setErrorMsg("Upload failed. Please try again.");
        return;
      }

      const historyId = responseData.user_history_id;
      window.location.href = `/user/userhistory/${historyId}`;
    } catch (error) {
      console.error("Upload failed", error);
      setErrorMsg("Upload failed. Please try again.");
      setUploadDisabled(false);
      setProcessing(false);
    }
  };

  // Fetch user info to set default target language
  const requestInfo = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/get_user_info",
        {
          credentials: "include",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (response.status === 429) {
        const data = await response.json();
        alert(`${data.detail}. Retry after ${data.retry_after} seconds.`);
        return;
      }

      const json = await response.json();

      // Find language matching user's default_language label
      const found = languages.find(
        (lang: { code: string; label: string }) => lang.label === json.default_language
      );

      if (found) {
        setTargetLang(found.code);
      }
    } catch (err) {
      console.error("Error fetching user info", err);
    }
  };

  // Show processing screen if translation is in progress
  if (processing) {
    return <Processing />;
  }

  return (
    <div className="min-h-screen mx-auto w-full max-w-[1080px] bg-gradient-to-b from-indigo-50 via-white to-white py-8">
      <main className="mx-auto w-full max-w-md px-4">
        {/* header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow">
            <Camera size={18} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Camera & Image Translate
            </h1>
            <p className="text-sm text-gray-500">
              Snap a photo or upload from your library.
            </p>
          </div>
        </div>

        {/* card */}
        <div className="rounded-3xl bg-white p-4 shadow-xl ring-1 ring-black/5">
          <form onSubmit={handleUpload} className="space-y-5">
            {/* video / preview area */}
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

                {/* overlay grid */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M33.33 0v100M66.66 0v100M0 33.33h100M0 66.66h100"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>

                {/* camera controls */}
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

                {/* starting overlay */}
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
              // image preview
              <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200">
                <img
                  src={picture.picturePreview}
                  alt="Preview"
                  className="max-h-[420px] w-full object-contain bg-gray-50"
                />
              </div>
            ) : (
              // upload dropzone
              <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white shadow">
                  <ImageIcon size={20} className="text-gray-600" />
                </div>
                <p className="text-sm text-gray-700">
                  Drag & drop an image here, or
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        inputRef.current?.click();
                      } catch (err) {
                        console.error("Error opening file picker", err);
                        setErrorMsg("Failed to open file picker.");
                      }
                    }}
                    className="ml-1 font-medium text-indigo-600 underline-offset-2 hover:underline"
                  >
                    browse your files
                  </button>
                  .
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG up to ~10MB
                </p>
              </div>
            )}

            {/* hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={uploadPicture}
              className="hidden"
            />

            {/* main buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {!camera && !picture && (
                <>
                  <button
                    onClick={() => {
                      try {
                        inputRef.current?.click();
                      } catch (err) {
                        console.error("Error opening file picker", err);
                        setErrorMsg("Failed to open file picker.");
                      }
                    }}
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
                    onClick={() => {
                      try {
                        inputRef.current?.click();
                      } catch (err) {
                        console.error("Error opening file picker", err);
                        setErrorMsg("Failed to open file picker.");
                      }
                    }}
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

            {/* language selector */}
            <div className="grid gap-2">
              <label
                htmlFor="targetLang"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Languages size={16} />
                Translate to
              </label>
              <select
                id="targetLang"
                value={targetLang}
                onChange={(e) => {
                  try {
                    setTargetLang(e.target.value);
                  } catch (err) {
                    console.error("Error setting target language", err);
                    setErrorMsg("Failed to change target language.");
                  }
                }}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {languages.map(
                  (lang: { code: string; label: string }) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  )
                )}
              </select>
              <p className="text-xs text-gray-500">
                Choose the output language for the translation.
              </p>
            </div>

            {/* error message */}
            {errorMsg && (
              <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
                {errorMsg}
              </div>
            )}
          </form>
        </div>

        {/* footer hint */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Tip: Good lighting improves OCR accuracy for translations.
        </p>
      </main>
    </div>
  );
}
