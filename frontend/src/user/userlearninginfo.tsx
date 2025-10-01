/**
 * User learning info page that pull up user's learning goals, such as target language, difficulty..
 * 
 * TODO:
 * Connect with DB
 * Avata size adjustment
 * Make a cancel button
 * Replace inline editor with a modal/select later.
 * Learning Row function: should it be nested function? ask intructor
 * Add clear button, back button
 */
import React, { useRef, useState } from "react";
import { Camera, Pencil, Info } from "lucide-react"; 

export default function UserLearningInfo() {
  type Row = {
        label: string;        
        sublabel: string;    
        key: "language" | "difficulty" | "goal";
      };
      
  // Hardcoded data
  const ROWS: Row[] = [
        { key: "language",   label: "Portuguese", sublabel: "Target Language" },
        { key: "difficulty", label: "Medium",     sublabel: "Quiz difficulty" },
        { key: "goal",       label: "Travel",     sublabel: "Learning Goal" },
      ];

  // Hardcoded data
  const [name, setName] = useState("Melissa peters");
  const [avatarUrl, setAvatarUrl] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpCWL__69pek5fgjE8HfImGkxYXrKsLdHAg&s"); 
  const [language, setLanguage] = useState("Portuguese");
  const [difficulty, setDifficulty] = useState("Medium");
  const [goal, setGoal] = useState("Travel");

  const fileRef = useRef<HTMLInputElement | null>(null);

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);
  }

  // Tiny inline editor via prompt (quick to wire). Replace with a modal/select later.
  function editRow(row: Row) {
    const current =
      row.key === "language" ? language :
      row.key === "difficulty" ? difficulty : goal;

    const next = prompt(`Edit ${row.sublabel}`, current || "");
    if (next === null) return;

    if (row.key === "language") setLanguage(next.trim() || current);
    if (row.key === "difficulty") setDifficulty(next.trim() || current);
    if (row.key === "goal") setGoal(next.trim() || current);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Banner with curved bottom */}
      <div className="relative h-36 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpCWL__69pek5fgjE8HfImGkxYXrKsLdHAg&s')" }} 
          aria-hidden="true"
        />
        <svg
          className="absolute -bottom-1 left-0 w-full"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,80 C320,140 1120,0 1440,60 L1440,120 L0,120 Z" fill="white" />
        </svg>

        {/* Avatar */}
        <div className="absolute left-1/2 top-[84%] -translate-x-1/2">
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
      <div className="mx-auto max-w-sm px-5 pt-12 pb-24">
        {/* Name + edit */}
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-semibold text-indigo-900">{name}</h1>
          <button
            type="button"
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            onClick={() => {
              const n = prompt("Edit display name:", name);
              if (n !== null) setName(n);
            }}
            aria-label="Edit display name"
          >
            <Pencil size={16} />
          </button>
        </div>

        {/* helper line */}
        <div className="mt-2 flex items-center justify-center gap-2 text-gray-500">
          <Info size={14} />
          <span className="text-sm">Edit your personal info</span>
        </div>

        {/* Learning rows */}
        <div className="mt-8 space-y-6 text-center">
          <LearningRow
            title={language}
            subtitle="Target Language"
            onEdit={() => editRow(ROWS[0])}
          />
          <LearningRow
            title={difficulty}
            subtitle="Quiz difficulty"
            onEdit={() => editRow(ROWS[1])}
          />
          <LearningRow
            title={goal}
            subtitle="Learning Goal"
            onEdit={() => editRow(ROWS[2])}
          />
        </div>
      </div>
    </div>
  );
}

/** one centered row: Big label + pencil, small gray sublabel */
function LearningRow({
  title,
  subtitle,
  onEdit,
}: {
  title: string;
  subtitle: string;
  onEdit: () => void;
}) {
  return (
    <div>
      <div className="mx-auto inline-flex items-center gap-2">
        <h2 className="text-xl font-semibold text-indigo-900">{title}</h2>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          aria-label={`Edit ${subtitle}`}
        >
          <Pencil size={16} />
        </button>
      </div>
      <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
        {subtitle}
      </div>
    </div>
  );
}
