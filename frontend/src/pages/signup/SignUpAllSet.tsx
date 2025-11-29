/**
 * This page is the end of sign up.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpringMotionLayout from "../../components/animation/SpringMotionLayout";
import { useSignup } from "../signup/SignupContext";
import type { StepProps } from "./Types";

export default function SignUpAllSet({ onPrev }: StepProps) {
  const { data, reset } = useSignup();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let redirectTimer: number | null = null;

    const submitAll = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_SERVER_URL + "/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });

        if (!res.ok) throw new Error("Signup failed");

        await res.json().catch(() => ({}));

        if (!cancelled) {
          reset();

          redirectTimer = window.setTimeout(() => {
            if (!cancelled) {
              window.location.href = "http://localhost:3000/?guide=1";
            }
          }, 1500);
        }
      } catch (e) {
        console.error(e);
        console.error("Could not complete signup. Please try again.");
        window.alert("Signup failed")
      }
    };

    submitAll();

    return () => {
      cancelled = true;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, []);

  const renderErrorModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <h2 className="mb-2 text-xl font-semibold text-red-600">Signup Failed</h2>
        <p className="mb-6 text-gray-600">{error}</p>

        <div className="space-y-3">
          <button
            onClick={() => {
              try {
                setError(null); 
                onPrev();      
              } catch (err) {
                console.error("Error going back to previous step:", err);
              }
            }}
            className="w-full rounded-full bg-gray-900 px-5 py-3 font-medium text-white shadow hover:bg-gray-800"
          >
            Go Back & Fix Info
          </button>

          <button
            onClick={() => {
              try {
                navigate("/login");
              } catch (err) {
                console.error("Error navigating to login:", err);
              }
            }}
            className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 font-medium text-gray-900 shadow hover:bg-gray-50"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <SpringMotionLayout
        titleLines={[`${data.name || "User"},`, "You're", "All Set!"]}
        imageSrc="https://preview.redd.it/what-is-your-opinion-on-pingu-v0-tmg61ucmri3d1.png?auto=webp&s=bd2b54bbba31c4d3d0bb459bced615e594a5c1ff"
      >
        <p>Finishing your account…</p>
        <p className="text-sm text-gray-500">Launching a quick tour next.</p>
      </SpringMotionLayout>

      {error && renderErrorModal()}
    </div>
  );
}
