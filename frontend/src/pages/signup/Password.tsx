/**
 * The third page for sign up.
 * Includes animation effects for smooth transitions.
 * This page takes only user's password
 * User name is an non-empty string, more than 8 chars
 * 
 * TODO:
 *
 * Connect with DB
 * Figure out correct button sizes
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import PasswordInputStep from "../../components/utils/PasswordInputStep";


export default function PasswordStep() {
  const [password, setPassword] = React.useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (s: string) => {
    if (!s) return "Please enter a password.";
    // i have no specific reason to choose 8 chars for the password length 
    if (s.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

//   const submitPassword = async (cleanPassword: string) => {
    
//     const salt = bcrypt.genSaltSync(10)
        
//     const hashedPassword = bcrypt.hashSync(event.currentTarget.password.value, '$2a$10$CwTycUXWue0Thq9StjUM0u'); 
//     const body = { hashedPassword: cleanPassword };

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

//     throw new Error(json?.message || "Could not save your password. Try again.");
//   };

  const submitPassword = async (cleanPassword: string) => {
    const redirect = "http://localhost:3000/signup/targetlan";
    window.location.replace(redirect);
  }

  return (
    <SpringMotionLayout 
      titleLines={["Create", "A", "Password"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
      >
      <PasswordInputStep
        value={password}
        onChange={setPassword}
        inputName="password"
        placeholder="password"
        autoComplete="password"
        onPrevious={() => navigate(-1)}
        onSubmit={submitPassword}
        validate={validatePassword}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-3 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
        aria-label={show ? "Hide password" : "Show password"}
      >
      </button>
    </SpringMotionLayout>
  );
}