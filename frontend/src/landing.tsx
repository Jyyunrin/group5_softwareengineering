// Landing page (homepage) after login
import "./landing.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLanguageMeta } from "../src/components/utils/LanguageSuggest";
import QuickGuide from "./pages/quickguide/QuickGuide";
import Loading from "../src/pages/status/Loading";
import GalleryPage from "./components/card/GalleryPage";
import Card from "./components/card/Cards";
import Logout from "./components/Logout";

export default function Landing() {
  const [params, setParams] = useSearchParams();
  const [name, setName] = useState("Language Learner");
  const [lang, setLang] = useState("FR");
  const [loading, setLoading] = useState(true);

  // show quick guide if ?guide=1
  const showGuide = params.get("guide") === "1";
  const navigate = useNavigate();
  
  // language metadata 
  const langMeta = getLanguageMeta(lang);
  const displayFlag = langMeta?.flag ?? "🏳️";
  const displayCode = langMeta?.code ?? lang.toUpperCase();
  const displayName = langMeta?.label ?? "Unknown";

  // fetch user info / learning info from backend
  const requestInfo = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/userlearninginfo",
        {
          method: "get",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      // not logged in, redirect to login
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      // rate limited, show message
      if (response.status === 429) {
        const data = await response.json();
        alert(`${data.detail}. Retry after ${data.retry_after} seconds.`);
        return;
      }

      const json = await response.json();

      // set name and default target language
      setName(json.user_info.name);
      setLang(json.user_info.default_lang_id);
    } catch (err) {
      console.error("Error loading user info", err);
      alert("Error loading user info");
    } finally {
      setLoading(false);
    }
  };

  // call requestInfo on mount with small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      requestInfo();
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // show loading spinner while fetching user info
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* quick guide overlay (optional) */}
      {showGuide && <QuickGuide />}

      {/* main content container */}
      <main className="mx-auto w-full max-w-[1080px] px-5 pb-24">
        {/* greeting + logout */}
        <section className="flex justify-between align-text-bottom pt-10">
          <div className="text-left">
            <h1
              className="text-4xl font-extrabd leading-tight tracking-tight"
              data-guide="welcome-title"
            >
              Hello,
              <br />
              {name}!
            </h1>
          </div>

          <div className="text-right text-sm text-gray-600">
            <Logout />
          </div>
        </section>

        {/* quick guide button + target language edit */}
        <section>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
            <button
              className="inline-flex items-center gap-1"
              onClick={() => setParams({ guide: "1" })}
              data-guide="quick-guide-button"
            >
              Quick Guide <span aria-hidden>→</span>
            </button>

            <button
              className="inline-flex items-center gap-2"
              data-guide="target-language"
              onClick={() => navigate("/user/userlearninginfo")}
            >
              <span>Target Language:</span>
              <span role="img" aria-label={`${displayName} flag`}>
                {" "}
                {displayFlag} {displayCode}{" "}
              </span>
              <span aria-hidden>✎</span>
            </button>
          </div>
        </section>

        {/* daily quiz card */}
        <section className="mt-6" data-guide="daily-quiz-card">
          <div className="overflow-hidden rounded-3xl bg-gray-100 shadow">
            <Card
              image="https://yt3.googleusercontent.com/8cgZMlfbExlkCdKjgJjxmHqa80xJ6WByNIbayrhS3AN3TbumcJO3TnujIq61nYh9vZWWMW7eUg=s900-c-k-c0x00ffffff-no-rj"
              title="Quiz Time!: Build Your Stack"
              description="I feel sleepy......I know you're also sleepy...."
            >
              <button
                className="mt-2 grid h-12 w-12 place-items-center rounded-full bg-gray-900 text-white"
                aria-label="Play"
                onClick={() => navigate("/quiz/start")}
              >
                ▶
              </button>
            </Card>
          </div>
        </section>

        {/* likes / search history gallery */}
        <section className="mt-7" data-guide="likes-history">
          <div className="mt-4">
            <GalleryPage />
          </div>
        </section>
      </main>
    </div>
  );
}
