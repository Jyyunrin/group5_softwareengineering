/**
 * Landing page(homepage) after log-in.
 */
import './landing.css';
import { useSearchParams, useNavigate } from "react-router-dom";
import QuickGuide from "./pages/quickguide/QuickGuide";
import Card from './components/card/Cards';
import GalleryPage from './components/card/GalleryPage';
import { Camera } from "lucide-react";
import Logout from './components/Logout';

export default function Landing() {
  const [params, setParams] = useSearchParams();
  const showGuide = params.get("guide") === "1";
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {showGuide && <QuickGuide />}

      <main className="mx-auto w-full max-w-[1080px] px-5 pb-24">
        {/* <section className="pt-6"> */}
          {/* 
          <h1
            className="text-4xl font-extrabold leading-tight tracking-tight"
            data-guide="welcome-title"
          >
            Olá,<br />
            <span>Username!</span>
          </h1> */}

        <section>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
            <button
              className="inline-flex items-center gap-1"
              onClick={() => setParams({ guide: "1" })}
              data-guide="quick-guide-button"
            >
              Quick Guide <span aria-hidden>→</span>
            </button>
            <div className="absolute top-4 right-4 z-50">
              <Logout />
            </div>  
            <button
              className="inline-flex items-center gap-2"
              data-guide="target-language"
              onClick={() => alert("open language picker")}
            >
            

            {/* Dynamic data needed */}
              <span>Target Language:</span>
              <span role="img" aria-label="Portuguese flag">🇵🇹</span>
              <span aria-hidden>✎</span>
            </button>
          </div>
        </section>

        {/* Quiz Card */}
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

        {/* Likes / Search history */}
        <section className="mt-7" data-guide="likes-history">
          <div className="mt-4">
            <GalleryPage />
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <div className="fixed inset-x-0 bottom-6 z-50 flex items-center justify-center">
        <button
          className="grid h-24 w-24 place-items-center rounded-full"
          aria-label="Open Camera Translate"
        >
        </button>
      </div>
    </div>
  );
}
