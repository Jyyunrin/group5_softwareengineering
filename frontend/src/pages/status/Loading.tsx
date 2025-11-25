/**
 * A page with animated dots and loading message.
 * Same layout as translation/processing
 */
import { useEffect, useState } from "react";
export default function Loading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true); 
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen mx-auto w-full max-w-[1080px] grid place-items-center bg-white transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
      {/* Dot frames */}
      <style>{`
        @keyframes throb {
          0%, 100% { transform: scale(.86); opacity: .65; }
          50%      { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      <div className="text-center">
        {/* Dot Animation */}
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

        <h1 className="text-5xl font-extrabold tracking-tight">Loading</h1>
        <p className="mt-2 text-sm text-gray-400">Looking for your page...</p>
        <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP3PMMfXGAT6tSF8Nbik6ixCUHLRjFHOc1Og&s"
        alt=""
        />
      </div>
    </div>
  );
}
