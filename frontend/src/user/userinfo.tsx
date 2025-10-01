/**
 * User info page that pull up user's basic detatils, such as name, password, dob...
 * 
 * TODO:
 * Connect with DB
 * Avata size adjustment
 * Make a cancel button
 * 
 */
import React, { useRef, useState } from "react";
import { Camera, Pencil, Eye, EyeOff } from "lucide-react"; 

export default function UserInfo() {
  // Hardcoded data
  const [name, setName] = useState("Melissa Peters");
  const [email, setEmail] = useState("melpeters@gmail.com");
  const [password, setPassword] = useState("************");
  const [showPw, setShowPw] = useState(false);
  const [dob, setDob] = useState("1996-05-23"); 
  const [country, setCountry] = useState("Nigeria");
  const [avatarUrl, setAvatarUrl] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpCWL__69pek5fgjE8HfImGkxYXrKsLdHAg&s"); 
  const fileRef = useRef<HTMLInputElement | null>(null);

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: send to API
    console.log({ name, email, password, dob, country, avatarUrl });
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top banner: Connected to user's favurite language(monumnets) */}
      <div className="relative h-36 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('data:image/jpeg;base64,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')" }} 
          aria-hidden="true"
        />
        {/* curve separator */}
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
      <div className="mx-auto max-w-sm px-5 pt-12 pb-20">
        {/* Display name with pencil */}
        <div className="mb-4 flex items-center justify-center gap-2">
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

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          {/* Password with toggle */}
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 outline-none focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute inset-y-0 right-3 my-auto grid h-8 w-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Date of birth */}
          <div>
            <label className="mb-1 block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {/* Country select */}
          <div>
            <label className="mb-1 block text-sm font-medium">Country</label>
            <select
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {[
                "Nigeria",
                "Canada",
                "United States",
                "Brazil",
                "United Kingdom",
                "Korea",
                "Japan",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Save button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-full bg-indigo-600 px-5 py-3 font-medium text-white shadow hover:bg-indigo-700 active:translate-y-[1px]"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
