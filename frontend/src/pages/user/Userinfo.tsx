/**
 * User info page that pull up user's basic detatils, such as name...
 * 
 * TODO:
 * Connect with DB
 * Save changes -> display success message
 * 
 */
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react"; 
import countries from "../../../data/countries.json";

export default function UserInfo() {
  // Hardcoded data - need to connect with DB
  const [name, setName] = useState("Melissa Peters");
  const [email, setEmail] = useState("melpeters@gmail.com");
  const [country, setCountry] = useState("Nigeria");
  const [avatarUrl, setAvatarUrl] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpCWL__69pek5fgjE8HfImGkxYXrKsLdHAg&s"); 
  const fileRef = useRef<HTMLInputElement | null>(null);

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: send to API

        let formData = {
            "new_username": name,
            "new_country": country,
        }
        const jsonData = JSON.stringify(formData)
    const response = await fetch(import.meta.env.VITE_SERVER_URL + "/update_user_info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: jsonData,
      }
    )
    .then(function(response) { return response.status })
    .then(function(status) {
      if (status == 200){
        window.location.reload()
      } else {
        window.alert("Unable to save changes")
      }
    })
    console.log({ name, email, country, avatarUrl });
  }

  const request_info = async() => {
    const response = await fetch(import.meta.env.VITE_SERVER_URL + "/get_user_info", {
        credentials: 'include',
      }
    )
    .then(function(response) { return response.json(); })
    .then(function(json) {
      // use the json
      setName(json.name)
      setEmail(json.email)
      setCountry(json.country)
    });
  }

  useEffect(()=>{
    request_info();
  }, [])

  return (
    <div className="min-h-screen mx-auto w-full max-w-[1080px] bg-white text-gray-900">
      {/* Top banner: Connected to user's favurite language(monumnets) : we may need to figure out for basic images */}
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
        <div className="mb-4 flex items-center justify-center gap-2">
          <h1 className="text-2xl font-semibold text-indigo-900">{name}</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>

            <div className="relative">
              <input
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none focus:border-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              {/* 
              <button
                type="button"
                className="absolute inset-y-0 right-3 my-auto grid h-7 w-7 place-items-center rounded-md text-gray-500 hover:bg-gray-100"
                onClick={() => {
                  const n = prompt('Edit your name:', name);
                  if (n !== null) setName(n);
                }}
                aria-label="Edit name"
              >
                <Pencil size={16} />
              </button> */}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          {/* Country select: dropdown menu. Looks a bit disgusting */}
          <div>
            <label className="mb-1 block text-sm font-medium">Country</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none focus:border-indigo-500"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Save / Cancel buttons */}
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
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
