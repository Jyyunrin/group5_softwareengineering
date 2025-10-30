/**
 * The very first page for sign up.
 * Includes animation effects for smooth transitions.
 * This page takes only user's name.
 * User name is an non-empty string.
 * 
 * TODO:
 *
 * Connect with DB
 * Figure out correct button sizes
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import TextInputStep from "../../components/utils/TextInputStep";

export default function NameStep() {
  const [username, setUserName] = React.useState("");
  const navigate = useNavigate();

  const validateName = (s: string) => {
    if (!s) return "Please enter your name.";
    if (s.length < 2) return "Name must be at least 2 characters.";
    
    return null;
  };

  // Need to comfirm with backend team
//   const submitName = async (cleanName: string) => {
//     const body = { username: cleanName };

//     const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/signup`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     const json = await res.json();

//     if (res.ok && (json?.success ?? true)) {

//       const redirect = import.meta.env.VITE_REDIRECT_URL || "/";
//       window.location.replace(redirect);
//       return;
//     }

//     throw new Error(json?.message || "Could not save your name. Try again.");
//   };

  const submitName = async (cleanName: string) => {
    const redirect = "http://localhost:3000/signup/email";
    window.location.replace(redirect);
  }

  return (
    <SpringMotionLayout
      titleLines={["What's", "Your", "Name?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <TextInputStep
        value={username}
        onChange={setUserName}
        inputName="username"
        placeholder="Your Name"
        autoComplete="username"
        onPrevious={() => navigate(-1)}
        onSubmit={submitName}
        validate={validateName}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
