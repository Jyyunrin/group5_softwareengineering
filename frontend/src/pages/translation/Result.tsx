/**
 * Result of AI translation page
 */
import { useEffect, useState } from "react";
import { X, Volume2, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type Example = { original: string; translation: string };

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const [responseData, setResponseData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = (location.state as any)?.data;
      setResponseData(data ?? null);
      if (!data) {
        setErrorMsg("No result data found. Try going back and uploading again.");
      }
    } catch (err) {
      console.error("Error reading route state", err);
      setErrorMsg("Failed to load result data. Please try again.");
    }
  }, [location.state]);

  console.log("responseData:", responseData);

  // Fallback UI
  const image =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABwECAwUGBAj/xAA7EAABAwMCBAIFCwQCAwAAAAABAAIDBAURBiESMUFRE2EHInGBwRQjMkJDUmKRobHRFTPS8MLxU3Ki/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABsRAQEBAAIDAAAAAAAAAAAAAAABETFhAiFB/9oADAMBAAIRAxEAPwCcUR...";
  const word = "Caneta";
  const subtitle = "eng. pen";
  const examples: Example[] = [
    {
      original: `${responseData?.translatedSentenceEasy}`|| "O menino escreve com lápis e caneta.",
      translation: `${responseData?.englishSentenceEasy}`|| "The boy writes with a pencil and a pen.",
    },
    {
      original: `${responseData?.translatedSentenceMed}`|| "Essa é uma caneta vermelha?",
      translation: `${responseData?.englishSentenceMed}`|| "Is that a red pen?",
    },
    {
      original: `${responseData?.translatedSentenceHard}`|| "Essa é uma caneta vermelha?",
      translation: `${responseData?.englishSentenceHard}`|| "Is that a red pen?",
    }
  ];

  const handleClose = () => {
    try {
      navigate(-1);
    } catch (err) {
      console.error("Error navigating back", err);
      setErrorMsg("Failed to go back. Please use your browser's back button.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-sm px-5 pb-10 pt-6">
        {/* Close Button (popup) */}
        <button
          aria-label="Close"
          onClick={handleClose}
          className="ml-auto block rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Optional error message */}
        {errorMsg && (
          <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
            {errorMsg}
          </div>
        )}

        {/* Image card */}
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <img
            src={image}
            alt={word}
            className="h-56 w-full rounded-2xl object-contain p-4"
          />
        </div>

        {/* Title row */}
        <div className="mt-6 flex items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">{word}</h1>
          {/* Pronunciation Button */}
          <button
            aria-label="Play pronunciation"
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <Volume2 size={18} />
          </button>
          {/* Like Button */}
          <button
            aria-label="Like"
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <Heart size={18} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

        {/* Examples */}
        <div className="mt-6 space-y-5">
          {examples.map((ex, i) => (
            <div key={i}>
              <p className="italic leading-relaxed">
                <em>{ex.original}</em>
              </p>
              <p className="mt-1 text-sm text-gray-400">{ex.translation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
