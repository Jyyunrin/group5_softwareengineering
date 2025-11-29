/**
 * A quiz page that displays a picture with a timer 
 * This page is not activated. This feature can be added in the future.
 */
import { useState, useRef } from "react";
import { Clock, Volume2, Pause } from "lucide-react";

export default function DailyQuizDefault() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fallback
  const correctAnswer = "Caneta";
  const options = ["Caneta", "Cânfora", "Caneca", "Cândido"];

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    setIsCorrect(selected === correctAnswer);
  };

  const handleSkip = () => {
    setSelected(null);
    setSubmitted(false);
    setIsCorrect(null);
  };

  const handleHintClick = () => setShowHint((prev) => !prev);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="text-center text-xl font-semibold text-gray-800">
          Daily Quiz
        </h2>

        {/* Timer */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          <div className="relative w-3/4">
            <input
              type="range"
              min="0"
              max="30"
              value={13}
              readOnly
              className="w-full accent-blue-500"
            />
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold bg-gray-800 text-white rounded-md px-1.5 py-0.5">
              13
            </span>
          </div>
        </div>

        {/* Image */}
        <div className="mt-5 flex justify-center">
          <img
            src="data:image/jpeg;base64,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"
            alt="quiz-item"
            className="h-40 w-40 object-contain"
          />
        </div>

        {/* Feedback */}
        {submitted && (
          <div className="mt-5 text-center">
            <h3
              className={`text-2xl font-bold ${
                isCorrect ? "text-blue-500" : "text-red-400"
              }`}
            >
              {selected}
            </h3>
            <p
              className={`mt-2 text-lg ${
                isCorrect ? "text-blue-400" : "text-red-300"
              }`}
            >
              {isCorrect ? "You’re correct!" : "Quite close!"}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Save this word to your favourite 💙
            </p>
          </div>
        )}

        {/* Options */}
        {!submitted && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`rounded-lg border px-3 py-2 font-medium transition ${
                  selected === opt
                    ? "bg-blue-500 text-white border-blue-600"
                    : "border-blue-300 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Hint + Actions */}
        <div className="mt-5 text-center text-sm text-gray-600">
          <div
            className="flex justify-center items-center gap-1 mb-2 cursor-pointer select-none"
            onClick={handleHintClick}
          >
            <span className="text-gray-500">❓</span>
            <span className="underline hover:text-gray-800">
              Do you need a hint?
            </span>
          </div>

          {/* Hint audio controls */}
          {showHint && (
            <div className="flex justify-center gap-3 mb-3">
              {!isPlaying ? (
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-50"
                >
                  <Volume2 className="h-4 w-4" /> Play
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-50"
                >
                  <Pause className="h-4 w-4" /> Pause
                </button>
              )}
              <audio
                ref={audioRef}
                src=""
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          )}

          {/* Skip / Submit / Next */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleSkip}
              className="rounded-full border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Skip
            </button>
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className={`rounded-full px-4 py-2 text-white ${
                  selected
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
