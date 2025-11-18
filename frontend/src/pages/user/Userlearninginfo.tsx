/**
 * User learning info page that pull up user's learning goals, such as target language, difficulty..
 * 
 * TODO:
 * Connect with DB
 * Add + button for 3rd or 4th languages
 * 
 */
import Loading from '../../pages/status/Loading';
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

// Disgusting....
// ISO 639-1 language names 
const LANGUAGES = [
  "Afrikaans","Akan","Albanian","Amharic","Arabic","Armenian","Assamese","Aymara","Azerbaijani",
  "Bambara","Basque","Belarusian","Bengali","Bosnian","Breton","Bulgarian","Burmese",
  "Catalan","Cebuano","Chamorro","Chechen","Chinese (Mandarin)","Chuvash","Cornish","Corsican","Croatian","Czech",
  "Danish","Dhivehi","Dutch","Dzongkha",
  "English","Esperanto","Estonian",
  "Faroese","Fijian","Finnish","French","Frisian (Western)",
  "Galician","Georgian","German","Greek","Guarani","Gujarati",
  "Haitian Creole","Hausa","Hawaiian","Hebrew","Hindi","Hmong","Hungarian",
  "Icelandic","Igbo","Ilocano","Indonesian","Irish","Italian",
  "Japanese","Javanese",
  "Kannada","Kazakh","Khmer","Kinyarwanda","Korean","Kurdish (Kurmanji)","Kurdish (Sorani)","Kyrgyz",
  "Lao","Latin","Latvian","Lingala","Lithuanian","Luganda","Luxembourgish",
  "Macedonian","Maithili","Malagasy","Malay","Malayalam","Maltese","Maori","Marathi","Meiteilon (Manipuri)","Mongolian",
  "Nepali","Norwegian Bokmål","Norwegian Nynorsk",
  "Odia (Oriya)","Oromo","Ossetian",
  "Pashto","Persian (Farsi)","Polish","Portuguese","Punjabi (Gurmukhi)","Punjabi (Shahmukhi)",
  "Quechua",
  "Romanian","Russian",
  "Samoan","Sanskrit","Scots Gaelic","Serbian","Sesotho","Shona","Sindhi","Sinhala","Slovak","Slovenian","Somali","Spanish","Sundanese","Swahili","Swedish",
  "Tagalog","Tahitian","Tajik","Tamil","Tatar","Telugu","Thai","Tibetan","Tigrinya","Tok Pisin","Turkish","Turkmen",
  "Uighur","Ukrainian","Urdu","Uyghur","Uzbek",
  "Vietnamese",
  "Welsh","Wolof",
  "Xhosa",
  "Yiddish","Yoruba",
  "Zulu",
];

const GOAL_OPTIONS = [
  { key: "business_travel", label: "Business travel" },
  { key: "touristic_travel", label: "Touristic travel" },
  { key: "image_translation", label: "Image translation" },
  { key: "study", label: "Study" },
  { key: "etc", label: "ETC" },
] as const;

export default function UserLearningInfo() {
  // Profile header (kept simple)
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpCWL__69pek5fgjE8HfImGkxYXrKsLdHAg&s"
  );
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Form state
  const [defaultLangId, setdefaultLangId] = useState(""); 
  const [defaultLang, setdefaultLang] = useState(""); 
  const [languages, setLanguages] = useState([]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");

  const [loading, setLoading] = useState(true);

  const fetchUserLearningInfo = async () => {
    let response = await fetch(import.meta.env.VITE_SERVER_URL + "/userlearninginfo", {
      method: "get",
      headers: {"Content-Type": "application/json"},
      credentials: "include"
    });

    if (response.status == 401) {
      window.location.href = "/login";
      return;
    }

    const data = await response.json();

    if (response.status == 429) {
      alert(`${data.detail}. Retry after ${data.retry_after} seconds.`);
      return;
    }

    setName(data.user_info.name);
    setLanguages(Object.values(data.languages));
    const defaultLangId = data.user_info.default_lang_id;
    setdefaultLangId(defaultLangId)
    if (defaultLangId && data.languages) {
      setdefaultLang(data.languages[defaultLangId]);
    }
    setDifficulty(data.user_info?.difficulty ? data.user_info.difficulty.toLowerCase().replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_: string, c: string) => c.toUpperCase()) : "");

    setLoading(false);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUserLearningInfo();
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // const [secondaryLang, setSecondaryLang] = useState("");        
  const [goals, setGoals] = useState<string[]>(["touristic_travel"]);

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);
  }

  function toggleGoal(key: string) {
    setGoals((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!defaultLang) {
      alert("Please select your default Learning Language.");
      return;
    }
    let data = {
      "defaultLang": defaultLang,
      "difficulty": difficulty.toLowerCase(),
      "goals": goals
    };
    try {
        let response = await fetch(import.meta.env.VITE_SERVER_URL + "/userlearninginfo", {
          method: "post",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data),
          credentials: "include"
        });
        const response_data = await response.json();
        if (response.status == 429) {
          alert(`${response_data.detail}. Retry after ${response_data.retry_after} seconds.`);
          return;
        }
        if (!response.ok) {
          alert("Error saving user info");
          return;
        }
        alert("Saved!");
      } catch (e) {
        console.error(e)
        alert("Error saving data")
      }
  }

  if (loading) {
    return <Loading />;
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
              onClick={() => fileRef.current?.click()}
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

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Default language (required) */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Default learning language <span className="text-red-500">* Required</span>
            </label>
            <select
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none focus:border-indigo-500"
              value={defaultLang}
              onChange={(e) => {
                setdefaultLang(e.target.value)}
              }
            >
              <option value="" disabled>
                Select a language…
              </option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Secondary language (optional) */}
          {/* <div>
            <label className="mb-1 block text-sm font-medium">
              Second learning language (optional)
            </label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none focus:border-indigo-500"
              value={secondaryLang}
              onChange={(e) => setSecondaryLang(e.target.value)}
            >
              <option value="">None</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div> */}

          {/* Consider add + button to add extra languages */}

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
                    onChange={() => setDifficulty(lvl)}
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
