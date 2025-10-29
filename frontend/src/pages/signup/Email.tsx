/**
 * The second page for sign up.
 * Includes animation effects for smooth transitions.
 * This page takes only user's email.
 * User name is an non-empty string, email format
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


export default function EmailStep() {
  const [email, setEmail] = React.useState("");
  const navigate = useNavigate();

  const validateEmail = (s: string) => {
    if (!s) return "Please enter your email.";

    // Light check without regex to avoid escaping issues here
    const hasAt = s.indexOf("@") > 0;
    const hasDot = s.lastIndexOf(".") > s.indexOf("@") + 1;
    return hasAt && hasDot ? null : "Please enter a valid email.";
  };

// Need to confirm with backend team
// const submitEmail = async (cleanEmail: string) => {
//     const body = { email: cleanEmail };

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

//     throw new Error(json?.message || "Could not save your email. Try again.");
//  };

  const submitEmail = async (cleanEmail: string) => {
    const redirect = "http://localhost:3000/signup/password";
    window.location.replace(redirect);
  }

  return (
    <SpringMotionLayout 
      titleLines={["What's", "Your", "Email?"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
      >
      <TextInputStep
        value={email}
        onChange={setEmail}
        inputName="email"
        placeholder="your@email.com"
        autoComplete="email"
        onPrevious={() => navigate(-1)}
        onSubmit={submitEmail}
        validate={validateEmail}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}