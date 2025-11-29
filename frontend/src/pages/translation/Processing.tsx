/**
 * Processing screen shown while an API call is in progress
 */
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen mx-auto w-full max-w-[1080px] grid place-items-center bg-white">
      {/* close button in top-right corner */}
      <button
        onClick={() => navigate(-1)} 
        className="absolute top-6 right-6 rounded-full p-2 bg-gray-100 hover:bg-gray-200 shadow transition active:scale-95"
        aria-label="Close"
      >
        <X size={20} className="text-gray-700" />
      </button>

      {/* keyframes for dot animation */}
      <style>{`
        @keyframes throb {
          0%, 100% { transform: scale(.86); opacity: .65; }
          50%      { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      <div className="text-center">
        {/* animated dots showing loading state */}
        <div className=" mb-10 flex items-center justify-center gap-6">
          <span
            className="inline-block h-4 w-4 rounded-full border-2 border-gray-700"
            style={{ animation: "throb 1.2s ease-in-out infinite", animationDelay: "0ms" }}
            aria-hidden
          />
          <span
            className="inline-block h-4 w-4 rounded-full border-2 border-gray-700"
            style={{ animation: "throb 1.2s ease-in-out infinite", animationDelay: "150ms" }}
            aria-hidden
          />
          <span
            className="inline-block h-4 w-4 rounded-full border-2 border-gray-700"
            style={{ animation: "throb 1.2s ease-in-out infinite", animationDelay: "300ms" }}
            aria-hidden
          />
          <span
            className="inline-block h-4 w-4 rounded-full border-2 border-gray-700"
            style={{ animation: "throb 1.2s ease-in-out infinite", animationDelay: "450ms" }}
            aria-hidden
          />
          <span
            className="inline-block h-4 w-4 rounded-full border-2 border-gray-700"
            style={{ animation: "throb 1.2s ease-in-out infinite", animationDelay: "600ms" }}
            aria-hidden
          />
        </div>

        {/* main text */}
        <h1 className="text-5xl font-extrabold tracking-tight">Processing</h1>
        <p className="mt-2 text-sm text-gray-400">powered by AI</p>
      </div>
    </div>
  );
}
