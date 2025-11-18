/**
 * User learning info page that pulls up user's learning goals, such as target language, difficulty.
 */
import React, { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { suggestLanguages } from "../../components/utils/LanguageSuggest"; 

const GOAL_OPTIONS = [
  { key: "business_travel", label: "Business travel" },
  { key: "touristic_travel", label: "Touristic travel" },
  { key: "image_translation", label: "Image translation" },
  { key: "study", label: "Study" },
  { key: "etc", label: "ETC" },
] as const;

type Difficulty = "Easy" | "Medium" | "Hard";
type LangOption = { label: string; value: string };

export default function UserLearningInfo() {
  // Fallback profile
  const [name] = useState("Melissa Peters");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpCWL__69pek5fgjE8HfImGkxYXrKsLdHAg&s"
  );
  const [defaultLang, setDefaultLang] = useState("Portuguese");
  const [langQuery, setLangQuery] = useState("Portuguese");
  const [langSuggestions, setLangSuggestions] = useState<LangOption[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [goals, setGoals] = useState<string[]>(["touristic_travel"]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const currentObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const q = langQuery.trim();
      if (!q) {
        setLangSuggestions([]);
        return;
      }
      const options = suggestLanguages(q);
      setLangSuggestions(options);
    } catch (err) {
      console.error("Error generating language suggestions:", err);
      setErrorMsg("Failed to suggest languages. You can still type manually.");
    }
  }, [langQuery]);

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMsg(null);
    try {
      const f = e.target.files?.[0];
      if (!f) return;

      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
        currentObjectUrlRef.current = null;
      }

      const url = URL.createObjectURL(f);
      currentObjectUrlRef.current = url;
      setAvatarUrl(url);
    } catch (err) {
      console.error("Error changing avatar:", err);
      setErrorMsg("Failed to load profile picture. Please try a different file.");
    }
  }

  function handleLangInputChange(value: string) {
    setErrorMsg(null);
    try {
      setLangQuery(value);
      setDefaultLang(value);
    } catch (err) {
      console.error("Error updating language input:", err);
      setErrorMsg("Failed to update language.");
    }
  }

  function handleLangSelect(option: LangOption) {
    setErrorMsg(null);
    try {
      setDefaultLang(option.value);
      setLangQuery(option.label);
      setLangSuggestions([]);
    } catch (err) {
      console.error("Error selecting language:", err);
      setErrorMsg("Failed to select language.");
    }
  }

  function toggleGoal(key: string) {
    setErrorMsg(null);
    try {
      setGoals((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    } catch (err) {
      console.error("Error toggling goal:", err);
      setErrorMsg("Failed to update learning goals.");
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    try {
      if (!defaultLang.trim()) {
        setErrorMsg("Please select your default learning language.");
        return;
      }

      console.log({
        defaultLang,
        difficulty,
        goals,
      });

      alert("Saved!");
    } catch (err) {
      console.error("Error submitting learning info:", err);
      setErrorMsg("Failed to save changes. Please try again.");
    }
  }

  function handleCancel() {
    setErrorMsg(null);
    try {
      window.history.back();
    } catch (err) {
      console.error("Error navigating back:", err);
      setErrorMsg("Failed to go back. Please use your browser's back button.");
    }
  }

  return (
    <div className="min-h-screen mx-auto w-full max-w-[1080px] bg-white text-gray-900">
      {/* Top banner */}
      <div className="relative h-36 w-full overflow-visible">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdiygjJ5zKTyCL0hp0jjWgqmUbQl6J57y27g&s')",
          }}
          aria-hidden="true"
        />
        <svg
          className="absolute -bottom-1 left-0 w-full z-0"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,80 C320,140 1120,0 1440,60 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>

        {/* Avatar */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-10">
          <div className="relative">
            <img
              src={avatarUrl}
              alt="Profile"
              className="h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            <button
              type="button"
              onClick={() => {
                try {
                  fileRef.current?.click();
                } catch (err) {
                  console.error("Error opening file dialog:", err);
                  setErrorMsg("Failed to open file picker.");
                }
              }}
              className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700"
              aria-label="Change profile photo"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-sm px-5 pt-20 pb-20">
        <div className="mb-6 flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-indigo-900">{name}</h1>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Default language (required) with suggestions */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Default learning language{" "}
              <span className="text-red-500">* Required</span>
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none focus:border-indigo-500"
                value={langQuery}
                onChange={(e) => handleLangInputChange(e.target.value)}
                placeholder="Start typing a language…"
              />
              {langSuggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white text-sm shadow">
                  {langSuggestions.map((opt) => (
                    <li
                      key={opt.value}
                      className="cursor-pointer px-3 py-2 hover:bg-indigo-50"
                      onClick={() => handleLangSelect(opt)}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="mb-2 block text-sm font-medium">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Easy", "Medium", "Hard"] as const).map((lvl) => (
                <label
                  key={lvl}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-center ${
                    difficulty === lvl
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={lvl}
                    checked={difficulty === lvl}
                    onChange={() => {
                      try {
                        setDifficulty(lvl);
                      } catch (err) {
                        console.error("Error setting difficulty:", err);
                        setErrorMsg("Failed to update difficulty.");
                      }
                    }}
                    className="hidden"
                  />
                  {lvl}
                </label>
              ))}
            </div>
          </div>

          {/* Learning goals */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Learning goals (choose any)
            </label>
            <div className="space-y-2">
              {GOAL_OPTIONS.map((g) => (
                <label
                  key={g.key}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={goals.includes(g.key)}
                    onChange={() => toggleGoal(g.key)}
                  />
                  <span>{g.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-1/2 rounded-full border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 shadow hover:bg-gray-50 active:translate-y-[1px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 rounded-full bg-indigo-600 px-5 py-3 font-medium text-white shadow hover:bg-indigo-700 active:translate-y-[1px]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
