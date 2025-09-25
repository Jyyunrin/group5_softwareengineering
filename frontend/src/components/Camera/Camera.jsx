import { useState, useRef } from "react";
import "./Camera.css";

export default function Camera() {
  const [picture, setPicture] = useState({});
  const inputRefCamera = useRef(null);
  const inputRefBrowse = useRef(null);

  const uploadPicture = (e) => {
    setPicture({
      /* contains the preview, if you want to show the picture to the user
           you can access it with this.state.currentPicture
       */
      picturePreview: URL.createObjectURL(e.target.files[0]),
      /* this contains the file we want to send */
      pictureAsFile: e.target.files[0],
    });
  };

  const setImageAction = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", picture.pictureAsFile);

    console.log(picture.pictureAsFile);

    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }

    // TODO: CHANGE THIS URL
    const data = await fetch("http://localhost:3000/upload/post", {
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });
    const uploadedImage = await data.json();
    if (uploadedImage) {
      console.log("Successfully uploaded image");
    } else {
      console.log("Error Found");
    }
  };

  // Open hidden inputs
  const openCamera = () => inputRefCamera.current.click();
  const openBrowse = () => inputRefBrowse.current.click();
  const clearImage = () => {
    setPicture({});
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
        />
        <input
          type="file"
          accept="image"
          name="image"
          ref={inputRefBrowse}
          onChange={uploadPicture}
        />

        {picture.picturePreview && (
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
        <button onClick={openCamera} className="camera-button">
          Take Photo
        </button>
        <button onClick={openBrowse} className="browse-button">
          Select Images
        </button>
        <button onClick={clearImage} classname="clear-button">
          Clear Image
        </button>
      </div>
    </>
  );
}
