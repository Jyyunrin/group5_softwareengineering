/**
 * The quiz result page that displays scores and suggests to practice or save
 * This page is not activated. This feature can be added in the future.
 */
import { useMemo } from "react";
import { ArrowRight, Star, Settings, BookmarkPlus } from "lucide-react";
import { addFavourite } from "./FavWords";

export default function DailyQuizResult() {
  // Fallback
  const scorePercent = 72;
  const correct = 18;
  const total = 25;
  const finishedAt = new Date();

  const score = Math.max(0, Math.min(100, Math.round(scorePercent)));
  const dateLabel = useMemo(
    () =>
      finishedAt.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [finishedAt]
  );

  const size = 160;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);

  const handlePracticeAgain = () => alert("Practice again clicked!");
  const handleAddToFavourite = () => addFavourite({
    srcLang: "Port",
    srcText: "Caneta",
    tgtLang: "Eng",
    tgtText: "Pen",
  });
  alert("Added to favourites!");
  const handleOpenFavourites = () => alert("Opening favourites...");
  const handleOpenSettings = () => alert("Opening settings...");

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-5">
      <main className="w-full max-w-sm rounded-3xl bg-white shadow-lg p-6">
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900">
            Daily Quiz
          </h1>
          <p className="text-xs text-gray-500">{dateLabel}</p>
        </header>

        <section className="grid grid-cols-2 gap-4">
          {/* Left text area */}
          <div className="col-span-1 rounded-3xl bg-gray-100 p-4 flex flex-col justify-center">
            <p className="text-2xl font-medium text-gray-900 leading-tight">
              Practice <span className="font-semibold">Again?</span>
            </p>
            <button
              onClick={handleAddToFavourite}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              <BookmarkPlus className="h-4 w-4" />
              Add To Favourite
            </button>
          </div>

          {/* Donut progress */}
          <div className="col-span-1 rounded-3xl bg-gray-100 p-4 flex items-center justify-center">
            <div className="relative">
              <svg width={size} height={size} className="block">
                {/* background ring */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth={stroke}
                />
                {/* progress ring */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  style={{ transition: "stroke-dashoffset 600ms ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-900">{score}%</div>
              </div>
              <div className="absolute inset-x-0 -bottom-2 text-center text-xs text-gray-500">
                {correct} / {total}
              </div>
            </div>
          </div>

          {/* Practice Again tile */}
          <button
            onClick={handlePracticeAgain}
            className="col-span-1 rounded-3xl bg-gray-100 p-6 text-left hover:bg-gray-200 transition"
          >
            <div className="text-2xl font-medium text-gray-900">Practice</div>
            <div className="text-2xl font-medium text-gray-900 -mt-1">Again</div>
            <ArrowRight className="mt-6 h-7 w-7 text-gray-800" />
          </button>

          {/* My Favourite tile */}
          <button
            onClick={handleOpenFavourites}
            className="col-span-1 rounded-3xl bg-gray-100 p-6 flex items-center justify-between hover:bg-gray-200 transition"
          >
            <div className="text-2xl font-medium text-gray-900 leading-tight">
              My
              <br />
              Favourite
            </div>
            <Star className="h-7 w-7 text-gray-800" />
          </button>

          {/* Quiz Setting tile */}
          <button
            onClick={handleOpenSettings}
            className="col-span-2 rounded-3xl bg-gray-100 p-6 flex items-center justify-between hover:bg-gray-200 transition"
          >
            <div className="text-2xl font-medium text-gray-900 leading-tight">
              Quiz
              <br />
              Setting
            </div>
            <Settings className="h-7 w-7 text-gray-800" />
          </button>
        </section>
      </main>
    </div>
  );
}
