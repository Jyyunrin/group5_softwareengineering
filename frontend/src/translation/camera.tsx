/**
 * Camera rendering page.
 * Users are able to take a picture with their basic device camera feature or
 * Users are able to pull up their gallery
 */
import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface Picture {
    picturePreview: string;
    pictureAsFile: File;
}

export default function Camera() {
    const [picture, setPicture] = useState<Picture | null>(null)
    const [camera, setCamera] = useState(false)

    // Stores stream while waiting for video element to load
    const [pendingStream, setPendingStream] = useState<MediaStream | null>(null)

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // When camera is on and videoRef is active, attach stream
    useEffect(() => {
        if (camera && pendingStream && videoRef.current) {
            videoRef.current.srcObject = pendingStream
            streamRef.current = pendingStream
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play()
            }
        }
    }, [camera, pendingStream])

    const startCamera = async() => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true})
            setPendingStream(stream)
            setCamera(true)
        } catch (error) {
            console.error("Error accessing camera", error)
            alert("Unable to access camera")
        }
    }

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        setCamera(false)
        setPendingStream(null)
    }

    const takePhoto = () => {

        // Check if video element is available, if not return
        if(!videoRef.current) return;
        const video = videoRef.current;

        // Create canvas used to screenshot current video frame
        const canvas = document.createElement("canvas")
        
        // Set dimensions of canvas to be same as video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Get 2d context, used to render onto canvas
        const context = canvas.getContext("2d")
        if(!context) return

        // Copy video frame at coordinate 0,0
        context.drawImage(video, 0, 0)

        canvas.toBlob((blob) => {
            if (!blob) return
            const file = new File([blob], "captured_image.png", { type: "image/png"})
            const preview = URL.createObjectURL(blob);
            setPicture({ picturePreview: preview, pictureAsFile: file})
            stopCamera();
        }, "image/png")
    }

    const uploadPicture = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPicture({
                picturePreview: URL.createObjectURL(e.target.files[0]),
                pictureAsFile: e.target.files[0]
            })
        }
    }

    // Clears current selected image
    const clearImage = () => {
        setPicture(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    // For rerouting to result page
    const navigate = useNavigate()

    // Handles upload of selected image
    const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!picture) return

        const formData = new FormData()
        formData.append("file", picture.pictureAsFile)
        try {
            const response = await fetch("http://localhost:8000/api/image-translate/", {
                method: "POST",
                body: formData
            })
            const responseData = await response.json()
            if(responseData) {
                navigate("/translation/result", { state: { data: responseData } });
            }
        } catch (error) {
            console.error("Upload failed", error)
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <form onSubmit={handleUpload} className="flex flex-col items-center space-y-4">
                <input type="file" accept="image/*" ref={inputRef} onChange={uploadPicture} className="hidden" />

                {camera && (
                    <div>
                        <div className="w-full h-72 bg-black rounded-lg flex items-center justify-center overflow-hidden">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"/>
                        </div>

                        <div className="flex space-x-4">
                            <button type="button" onClick={takePhoto}
                            className="mt-5 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-600 transition shadow">
                                Take Photo
                            </button>
                            <button type="button" onClick={stopCamera}
                            className="mt-5 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition shadow">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {picture?.picturePreview && !camera && (
                    <img src={picture.picturePreview} alt="Preview" 
                    className = "w-full h-80 object-contain rounded-lg border-4 border-gray-300"/>
                )}

                {picture && !camera && (
                    <button type="submit" className="px-8 py-2 bg-black text-white rounded hover:bg-gray-600 transition shadow">
                        Upload
                    </button>
                )}
            </form>

            {!camera && (
                <div className="space-x-6 mt-6">

                    <button onClick={() => inputRef.current?.click()} type="button"
                        className="bg-green-700 text-white rounded hover:bg-green-600 transition px-2 py-4 font-bold shadow">
                        Select Image
                    </button>

                    <button onClick={startCamera} type="button" 
                    className="bg-blue-800 text-white rounded hover:bg-blue-600 transition px-2 py-4 font-bold shadow">
                        Open Camera
                    </button>

                    <button onClick={clearImage} type="button"
                    className="bg-yellow-500 text-white rounded hover:bg-yellow-600 transition px-2 py-4 font-bold shadow">
                        Clear Image
                    </button>
                </div>
            )}
        </div>            
    )
}
