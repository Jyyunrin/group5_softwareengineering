/**
 * Camera rendring page.
 * Users are able to take a picture with their basic device camera feature or
 * Users are able to pull up their gallery
 * 
 * TODO:
 * Call camera compoentns for mobile device
 * 
 */
import { useState, useRef } from "react"
import type { ChangeEvent, FormEvent } from "react";

interface Picture {
  picturePreview: string;
  pictureAsFile: File;
}

export default function Camera() {
  const [picture, setPicture] = useState<Picture | null>(null);

  const inputRefCamera = useRef<HTMLInputElement | null>(null);
  const inputRefBrowse = useRef<HTMLInputElement | null>(null);

  const uploadPicture = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPicture({
        picturePreview: URL.createObjectURL(e.target.files[0]),
        pictureAsFile: e.target.files[0],
      });
    }
  };

  const setImageAction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!picture) {
      console.log("No picture selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", picture.pictureAsFile);

    console.log(picture.pictureAsFile);

    for (const [key, value] of formData.entries()) {
      console.log(key + ", " + value);
    }

    try {
      const response = await fetch("http://localhost:8000/api/image-translate/", {
        method: "POST",
        body: formData,
      });

      const uploadedImage = await response.json();
      if (uploadedImage) {
        console.log("Successfully uploaded image", uploadedImage);
        window.location.replace("http://localhost:3000/translation/result")
      } else {
        console.log("Error Found");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Open hidden inputs
  const openCamera = () => inputRefCamera.current?.click();
  const openBrowse = () => inputRefBrowse.current?.click();
  const clearImage = () => {
    setPicture(null);
    if (inputRefBrowse.current) {
      inputRefBrowse.current.value = "";
    }
  };

  return (
    <>
      <form onSubmit={setImageAction}>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={inputRefCamera}
          onChange={uploadPicture}
          style={{ display: "none" }}
        />
        <input
          type="file"
          accept="image/*"
          name="image"
          ref={inputRefBrowse}
          onChange={uploadPicture}
          style={{ display: "none" }}
        />

        {picture?.picturePreview && (
          <img
            src={picture.picturePreview}
            alt="Picture Preview"
            className="image-preview"
          />
        )}
        <button type="submit" name="upload">
          Upload
        </button>
      </form>

      <div>
        <button onClick={openCamera} className="camera-button" type="button">
          Take Photo
        </button>
        <button onClick={openBrowse} className="browse-button" type="button">
          Select Images
        </button>
        <button onClick={clearImage} className="clear-button" type="button">
          Clear Image
        </button>
      </div>
    </>
  );
}
