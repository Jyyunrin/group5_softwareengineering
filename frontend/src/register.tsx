/**
 * Log-in page 
 * 
 * TODO:
 * Implement user database 
 * Center-aligned items
 * Add mascot image
 * Adjust mascot 
 * Mobile testing
 */

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

export default function RegisterPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  // to backend team: please replace with auth call
  const attemptRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        let formData = {
            "email": event.currentTarget.email.value,
            "password": event.currentTarget.password.value,
        }
        const jsonData = JSON.stringify(formData)
        console.log(jsonData)

        // TODO: CHANGE THIS URL
        const data = await fetch(import.meta.env.VITE_SERVER_URL + "/register", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: jsonData,
        });

        const upload_response = await data.json();
        if (upload_response) {
            console.log("Successful register attempt");
            window.location.replace(import.meta.env.VITE_REDIRECT_URL + "/login")
        } else {
            console.log("Error Found");
            alert("Register failed")
        }
    }

  return (
    <div className="relative min-h-screen bg-white text-gray-900">
      {/* Mascot - fixed to the right bottom cornder. currently doesn't work */}
      <img
        src="https://www.google.com/imgres?q=pingu&imgurl=https%3A%2F%2Fimages.timesnownews.com%2Fthumb%2Fmsid-114447996%2Cthumbsize-21060%2Cwidth-1280%2Cheight-720%2Cresizemode-75%2F114447996.jpg&imgrefurl=https%3A%2F%2Fwww.timesnownews.com%2Fentertainment-news%2Fweb-series%2Fpingu-to-make-comeback-on-screens-heres-deets-about-new-series-article-114447673&docid=BtveUfAB-2bS7M&tbnid=ZXRYfmL3jBXS6M&vet=12ahUKEwj20eD0mIKQAxVmHjQIHWdNBYgQM3oECBIQAA..i&w=1280&h=720&hcb=2&ved=2ahUKEwj20eD0mIKQAxVmHjQIHWdNBYgQM3oECBIQAA" 
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-6 -left-6 w-60 sm:w-72 md:w-80"
      />

      {/* Center column */}
      <div className="mx-auto flex min-h-screen max-w-sm flex-col items-stretch px-6">
        {/* Spacer to push content a bit down on mobile */}
        <div className="h-8" />

        {/* Brand */}
        <h1 className="text-6xl sm:text-7xl font-medium tracking-tight mb-8">
          FANGO
        </h1>

        {/* Form */}
        <form onSubmit={attemptRegister} className="space-y-4">
          {/* ID */}
          <label className="block">
            <span className="sr-only">ID</span>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 focus:border-blue-500"
              autoComplete="username"
              name="email"
              required
            />
          </label>

          {/* Password with show/hide */}
          <label className="block relative">
            <span className="sr-only">Password</span>
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 outline-none focus:border-blue-500"
              autoComplete="current-password"
              name="password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute inset-y-0 right-3 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </label>

          {/* Sign In & Sign Up Buttons*/}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-sky-500 px-6 py-2.5 text-white font-medium hover:bg-sky-600 active:bg-sky-700 transition"
            >
              Sign Up
            </button>

            <button
              type="button"
              className="rounded-full border border-sky-500 px-6 py-2.5 text-sky-600 font-medium hover:bg-sky-50 active:bg-sky-100 transition"
              onClick={() => window.location.replace("http://localhost:3000/login")} //alert("Go to sign-in flow")}
            >
              Go To Sign In
            </button>
          </div>
        </form>

        <div className="flex-1" />
      </div>
    </div>
  );
}