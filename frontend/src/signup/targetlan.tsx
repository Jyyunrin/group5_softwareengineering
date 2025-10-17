/**
 * The fourth page of sing up
 * Includes animation effects for smooth transitions. 
 * This page takes only user's target language with dropdown menu
 * 
 * TODO:
 * Connect with DB 
 * 
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import SpringMotionLayout from "../components/SpringMotionLayout";
import TextInputStep from "../components/TextInputStep";
import SuggestInputStep from "../components/SuggestInputStep";
import { suggestLanguages } from "../utils/LanguageSuggest";

export default function SetUpTargetLan() {
    const [targetLan, setTargetLan] = React.useState("");
    const [confirmed, setConfirmed] = React.useState(false);
    const navigate = useNavigate();

    const validate = (s: string) => {
        if (!s) return "Please choose a target language.";
        if (s.length < 2) return "Language must be at least 2 characters.";
        return null;
        };

  // Need to comfirm with backend team
//   const submitTargetLang = async (cleanName: string) => {
//     const body = { targetLan: cleanName };

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

  const submitTargetLan = async (cleanTargetLan: string) => {
    const redirect = "http://localhost:3000/signup/difficulty";
    window.location.replace(redirect);
  }

  return (
    <SpringMotionLayout
      titleLines={["Choose", "Target", "Language"]}
      imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
    >
      <TextInputStep
        value={targetLan}
        onChange={(v) => { setConfirmed(false); setTargetLan(v); }}
        inputName="targetlang"
        placeholder="e.g., English, 日本語, 한국어"
        autoComplete="targetlang"
        onPrevious={() => navigate(-1)}
        onSubmit={submitTargetLan}
        validate={validate}
        submitLabel="Next →"
        prevLabel="← Previous"
      />
    </SpringMotionLayout>
  );
}
