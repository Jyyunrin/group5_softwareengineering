/**
 * Page for showing and updating user's learning preferences
 */
import Loading from "../../pages/status/Loading";
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import {
  LANGUAGES,
  getLanguageMeta,
} from "../../components/utils/LanguageSuggest";
import { options } from "../../components/goals/options";


type Difficulty = "Easy" | "Medium" | "Hard";
type LangOption = {
  id: string;    // e.g. "EN", "KO"
  label: string; // e.g. "English"
};

// build full static list of languages from LANGUAGES
const ALL_LANGUAGE_OPTIONS: LangOption[] = LANGUAGES.map((label) => {
  const meta = getLanguageMeta(label);
  return {
    id: meta?.code ?? label.toLowerCase(),
    label,
  };
});

export default function UserLearningInfo() {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpCWL__69pek5fgjE8HfImGkxYXrKsLdHAg&s"
  );
  const fileRef = useRef<HTMLInputElement | null>(null);

  // language selection state
  const [defaultLangId, setDefaultLangId] = useState(""); 
  const [defaultLang, setDefaultLang] = useState("");    
  const [languages, setLanguages] = useState<LangOption[]>(ALL_LANGUAGE_OPTIONS);
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [goals, setGoals] = useState<string[]>(["touristic_travel"]);
  const [loading, setLoading] = useState(true);

  // fetch user learning info from backend
  const fetchUserLearningInfo = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/userlearninginfo",
        {
          method: "get",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();
      console.log(data);

      // too many requests, show rate limit message
      if (response.status === 429) {
        alert(`${data.detail}. Retry after ${data.retry_after} seconds.`);
        return;
      }

      setName(data.user_info.name);

      // start from full static languages list
      let mergedLanguages: LangOption[] = [...ALL_LANGUAGE_OPTIONS];

      // merge backend languages if provided
      if (data.languages && typeof data.languages === "object") {
        // expected shape: { "FR": "French", "KO": "Korean", ... }
        for (const [id, label] of Object.entries<string>(data.languages)) {
          const idx = mergedLanguages.findIndex((l) => l.id === id);
          if (idx >= 0) {
            // override label if id already exists
            mergedLanguages[idx] = { id, label };
          } else {
            // add new entry if not found
            mergedLanguages.push({ id, label });
          }
        }
      }
      
      setLanguages(mergedLanguages);

      // default language id from server
      const langIdFromServer: string | undefined =
        data.user_info?.default_lang_id;

      if (langIdFromServer) {
        setDefaultLangId(langIdFromServer);

        // find label from merged languages
        const found = mergedLanguages.find((l) => l.id === langIdFromServer);
        if (found) {
          setDefaultLang(found.label);
        } else {
          const meta = getLanguageMeta(langIdFromServer);
          setDefaultLang(meta?.label ?? langIdFromServer);
        }
      }

      // difficulty from backend, map to "Easy" | "Medium" | "Hard"
      if (data.user_info?.difficulty) {
        const d = data.user_info.difficulty.toLowerCase();
        let mapped: Difficulty = "Easy";
        if (d === "medium") mapped = "Medium";
        if (d === "hard") mapped = "Hard";
        setDifficulty(mapped);
      }

      // goals from backend, if array
      if (Array.isArray(data.user_info?.goals)) {
        setGoals(data.user_info.goals);
      }
    } catch (err) {
      console.error("Error fetching user learning info:", err);
      alert("Error loading user info");
    } finally {
      setLoading(false);
    }
  };

  // run fetch once on mount with small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUserLearningInfo();
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // handle avatar file change
  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);
  }

  // toggle goal selection on/off
  function toggleGoal(key: string) {
    setGoals((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  // submit updated learning info to backend
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ensure language is selected
    if (!defaultLangId || !defaultLang) {
      alert("Please select your default learning language.");
      return;
    }

    const payload = {
      defaultLangId, // e.g. "EN"
      defaultLang, // e.g. "English"
      difficulty: difficulty.toLowerCase(), // "easy" | "medium" | "hard"
      goals,
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/userlearninginfo",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      const contentType = response.headers.get("content-type") || "";
      let response_data: any = null;

      // try to parse JSON response if available
      if (contentType.includes("application/json")) {
        try {
          response_data = await response.json();
        } catch (parseErr) {
          console.warn("Failed to parse JSON response:", parseErr);
        }
      } else {
        const text = await response.text();
        console.warn("Non-JSON response from server:", text);
      }

      // handle unauthorized
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      // handle rate limit
      if (response.status === 429 && response_data) {
        alert(
          `${response_data.detail}. Retry after ${response_data.retry_after} seconds.`
        );
        return;
      }

      // generic error
      if (!response.ok) {
        alert("Error saving user info");
        return;
      }

      // success
      alert("Saved!");
    } catch (e) {
      console.error(e);
      alert("Error saving data");
    }
  }

  // show loading spinner while fetching data
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen mx-auto w-full max-w-[1080px] bg-white text-gray-900">
      {/* top banner with background image */}
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

        {/* avatar over banner */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-10">
          <div className="relative">
            <img
              src={avatarUrl}
              alt="Profile"
              className="h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            {/* change avatar button */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700"
              aria-label="Change profile photo"
            >
              <Camera size={16} />
            </button>
            {/* hidden file input for avatar */}
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

      {/* main content */}
      <div className="mx-auto max-w-sm px-5 pt-20 pb-20">
        {/* user name heading */}
        <div className="mb-6 flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-indigo-900">{name}</h1>
        </div>

        {/* form for learning preferences */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* default language select */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Default learning language{" "}
              <span className="text-red-500">* Required</span>
            </label>
            <select
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none focus:border-indigo-500"
              value={defaultLangId}
              onChange={(e) => {
                const newId = e.target.value;
                setDefaultLangId(newId);

                const found = languages.find((l) => l.id === newId);
                setDefaultLang(found?.label ?? "");
              }}
            >
              <option value="" disabled>
                Select a language…
              </option>

              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* difficulty radio buttons */}
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
                    onChange={() => setDifficulty(lvl)}
                    className="hidden"
                  />
                  {lvl}
                </label>
              ))}
            </div>
          </div>

          {/* learning goals checkboxes */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Learning goals (choose any)
            </label>
            <div className="space-y-2">
              {options.map((g) => (
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

          {/* footer buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
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
