/**
 * User info page that pulls up user's basic details, such as name.
 */
import React, { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { suggestCountries } from "../../components/utils/CountrySuggest"; 

type CountryOption = { label: string; value: string };

export default function UserInfo() {
  const [name, setName] = useState("Melissa Peters");
  const [email, setEmail] = useState("melpeters@gmail.com");
  const [country, setCountry] = useState("Nigeria");
  const [countryQuery, setCountryQuery] = useState("Nigeria");
  const [countrySuggestions, setCountrySuggestions] = useState<CountryOption[]>([]);
  const [avatarUrl, setAvatarUrl] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpCWL__69pek5fgjE8HfImGkxYXrKsLdHAg&s"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const currentObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      if (!countryQuery) {
        setCountrySuggestions([]);
        return;
      }
      const suggestions = suggestCountries(countryQuery);
      setCountrySuggestions(suggestions);
    } catch (err) {
      console.error("Error generating country suggestions:", err);
      setErrorMsg("Failed to suggest countries. You can still type manually.");
    }
  }, [countryQuery]);

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMsg(null);
    try {
      const f = e.target.files?.[0];
      if (!f) return;

      // Revoke previous object URL if there was one
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    try {
      console.log({ name, email, country, avatarUrl });
      // You can send this data to your API here
    } catch (err) {
      console.error("Error submitting user info:", err);
      setErrorMsg("Failed to save changes. Please try again.");
    }
  }

  function handleCountryInputChange(value: string) {
    setErrorMsg(null);
    try {
      setCountryQuery(value);
      setCountry(value);
    } catch (err) {
      console.error("Error updating country input:", err);
      setErrorMsg("Failed to update country.");
    }
  }

  function handleCountrySelect(option: CountryOption) {
    try {
      setCountry(option.value);
      setCountryQuery(option.label);
      setCountrySuggestions([]);
    } catch (err) {
      console.error("Error selecting country:", err);
      setErrorMsg("Failed to select country.");
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

  const request_info = async() => {
    const response = await fetch(import.meta.env.VITE_SERVER_URL + "/get_user_info", {
        credentials: 'include',
      }
    )
    .then(function(response) { 
      if (response.status == 401) {
        window.location.href = "/login";
        return;
      }
      if (response.status == 429) {
        response.json().then(function(data) {
          alert(`${data.detail}. Retry after ${data.retry_after} seconds.`);
        });
        return;
      }

      return response.json();
    })
    .then(function(json) {
      // use the json
      setName(json.name)
      setEmail(json.email)
      setCountry(json.country)
    });
    setLoading(false);
  }

  useEffect(()=>{
    const timer = setTimeout(() => {
      request_info();
    }, 1200);
    return () => clearTimeout(timer);
  }, [])

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
        {/* curve separator */}
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
        <div className="absolute left-1/2 top-[84%] -translate-x-1/2">
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
              className="hidden" />
          </div>
        </div>
  
      {/* Content */}
      <div className="mx-auto max-w-sm px-5 pt-25 pb-20">
        <div className="mb-4 flex items-center justify-center gap-2">
          <h1 className="text-2xl font-semibold text-indigo-900">{name}</h1>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none focus:border-indigo-500"
                value={name}
                onChange={(e) => {
                  try {
                    setName(e.target.value);
                  } catch (err) {
                    console.error("Error updating name:", err);
                    setErrorMsg("Failed to update name.");
                  }
                }}
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none focus:border-indigo-500"
              value={email}
              onChange={(e) => {
                try {
                  setEmail(e.target.value);
                } catch (err) {
                  console.error("Error updating email:", err);
                  setErrorMsg("Failed to update email.");
                }
              }}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          {/* Country with suggestions */}
          <div>
            <label className="mb-1 block text-sm font-medium">Country</label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 outline-none focus:border-indigo-500"
                value={countryQuery}
                onChange={(e) => handleCountryInputChange(e.target.value)}
                placeholder="Start typing your country..."
              />
              {countrySuggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white text-sm shadow">
                  {countrySuggestions.map((opt) => (
                    <li
                      key={opt.value}
                      className="cursor-pointer px-3 py-2 hover:bg-indigo-50"
                      onClick={() => handleCountrySelect(opt)}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Save / Cancel buttons */}
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
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
