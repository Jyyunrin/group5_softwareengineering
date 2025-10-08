/**
 * User info page that pull up user's basic detatils, such as name, password, dob...
 * 
 * TODO:
 * Connect with DB
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
    <div className="min-h-screen mx-auto w-full max-w-[1080px] bg-white text-gray-900">
      {/* Top banner: Connected to user's favurite language(monumnets) */}
      <div className="relative h-36 w-full overflow-visible">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 
            "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdiygjJ5zKTyCL0hp0jjWgqmUbQl6J57y27g&s')" 
          }} 
          aria-hidden="true"
        />
        {/* curve separator */}
        <svg
          className="absolute -bottom-1 left-0 w-full z-0"
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
      <div className="mx-auto max-w-sm px-5 pt-25 pb-20">
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
