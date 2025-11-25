/**
 * UserHistory Page of individual items (same as result page for now)
 * 
 * TODO:
 * Connect with DB 
 * Buttons functionality: pronunciation button, like button
 */
import { X, Volume2, Heart } from "lucide-react"; 
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react"; 

export default function UserHistoryItem() {
  type Example = { original: string; translation: string };
  const { history_id } = useParams();
  const [responseData, setResponseData] = useState<any | null>(null)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!history_id) return;

    const url = import.meta.env.VITE_SERVER_URL + `/get_user_history/${history_id}`;

    fetch(url, {
      credentials: "include",
    })
    .then(res=>res.json())
    .then(data => setResponseData(data))
  }, [history_id])

  // Hardcoded data
  const image = `${responseData?.url}`|| "data:image/jpeg;base64,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"; 
  const word = `${responseData?.translation}`||"Caneta";
  const subtitle = `${responseData?.english}`||"eng. pen";
  const examples: Example[] = [
    {
      original: `${responseData?.translatedSentenceEasy}`|| "O menino escreve com lápis e caneta.",
      translation: `${responseData?.englishSentenceEasy}`|| "The boy writes with a pencil and a pen.",
    },
    {
      original: `${responseData?.translatedSentenceMed}`|| "Essa é uma caneta vermelha?",
      translation: `${responseData?.englishSentenceMed}`|| "Is that a red pen?",
    },
    {
      original: `${responseData?.translatedSentenceHard}`|| "Essa é uma caneta vermelha?",
      translation: `${responseData?.englishSentenceHard}`|| "Is that a red pen?",
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-sm px-5 pb-10 pt-6">
        {/* Close Button (popup) */}
        <button
          aria-label="Close"
          onClick={() => navigate(-1)}
          className="ml-auto block rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Image card */}
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <img
            src={image}
            alt={word}
            className="h-56 w-full rounded-2xl object-contain p-4"
          />
        </div>

        {/* Title row */}
        <div className="mt-6 flex items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">{word}</h1>
          {/* Pronunciation Button */}
          <button
            aria-label="Play pronunciation"
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <Volume2 size={18} />
          </button>
          {/* Like Button */}
          <button
            aria-label="Like"
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <Heart size={18} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

        {/* Examples */}
        <div className="mt-6 space-y-5">
          {examples.map((ex, i) => (
            <div key={i}>
              <p className="italic leading-relaxed">
                <em>{ex.original}</em>
              </p>
              <p className="mt-1 text-sm text-gray-400">{ex.translation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
