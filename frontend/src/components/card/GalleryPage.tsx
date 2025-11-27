/**
 * Card component details for Likes and History.
 * Card data contains an image, a word, a language, details and id.
 * Pagination is available for navigate large data set.
 * Hardcoded data will show up if backend is not connected.
 * 
 * Paired with ImageFlipCard.tsx
 */
import { useEffect, useState } from "react";
import CardMenu from "./CardMenu";
import ImageFlipCard from "./ImageFlipCard";
type Tab = "likes" | "history";

const likesData = [
  { id: 1, image_url: "https://picsum.photos/seed/a/600/400", word_english: "Sunset Dune", language: "C", word_translated: "Warm dunes at dusk…" },
  { id: 2, image_url: "https://picsum.photos/seed/b/600/400", word_english: "River Stone", language: "ELIXIR", word_translated: "Smooth river stones…" },
  { id: 3, image_url: "https://picsum.photos/seed/c/600/400", word_english: "Forest Path", language: "JAVA", word_translated: "Shaded path through pines…" },
  { id: 7, image_url: "https://picsum.photos/seed/g/600/400", word_english: "Golden Field", language: "JS", word_translated: "Grassy fields under sun…" },
  { id: 8, image_url: "https://picsum.photos/seed/h/600/400", word_english: "Stone Bridge", language: "RUST", word_translated: "Bridge across small creek…" },
  { id: 9, image_url: "https://picsum.photos/seed/i/600/400", word_english: "Lava Flow", language: "C++", word_translated: "Molten lava at night…" },
  { id: 10, image_url: "https://picsum.photos/seed/j/600/400", word_english: "Aurora Sky", language: "SWIFT", word_translated: "Dancing lights above ice…" },
  { id: 1, image_url: "https://picsum.photos/seed/a/600/400", word_english: "Sunset Dune", language: "C", word_translated: "Warm dunes at dusk…" },
  { id: 2, image_url: "https://picsum.photos/seed/b/600/400", word_english: "River Stone", language: "ELIXIR", word_translated: "Smooth river stones…" },
  { id: 3, image_url: "https://picsum.photos/seed/c/600/400", word_english: "Forest Path", language: "JAVA", word_translated: "Shaded path through pines…" },
  { id: 7, image_url: "https://picsum.photos/seed/g/600/400", word_english: "Golden Field", language: "JS", word_translated: "Grassy fields under sun…" },
  { id: 8, image_url: "https://picsum.photos/seed/h/600/400", word_english: "Stone Bridge", language: "RUST", word_translated: "Bridge across small creek…" },
  { id: 9, image_url: "https://picsum.photos/seed/i/600/400", word_english: "Lava Flow", language: "C++", word_translated: "Molten lava at night…" },
  { id: 10, image_url: "https://picsum.photos/seed/j/600/400", word_english: "Aurora Sky", language: "SWIFT", word_translated: "Dancing lights above ice…" },
  { id: 1, image_url: "https://picsum.photos/seed/a/600/400", word_english: "Sunset Dune", language: "C", word_translated: "Warm dunes at dusk…" },
  { id: 2, image_url: "https://picsum.photos/seed/b/600/400", word_english: "River Stone", language: "ELIXIR", word_translated: "Smooth river stones…" },
  { id: 3, image_url: "https://picsum.photos/seed/c/600/400", word_english: "Forest Path", language: "JAVA", word_translated: "Shaded path through pines…" },
  { id: 7, image_url: "https://picsum.photos/seed/g/600/400", word_english: "Golden Field", language: "JS", word_translated: "Grassy fields under sun…" },
  { id: 8, image_url: "https://picsum.photos/seed/h/600/400", word_english: "Stone Bridge", language: "RUST", word_translated: "Bridge across small creek…" },
  { id: 9, image_url: "https://picsum.photos/seed/i/600/400", word_english: "Lava Flow", language: "C++", word_translated: "Molten lava at night…" },
  { id: 10, image_url: "https://picsum.photos/seed/j/600/400", word_english: "Aurora Sky", language: "SWIFT", word_translated: "Dancing lights above ice…" },
];

const historyData = [
  { id: 4, image_url: "https://picsum.photos/seed/d/600/400", word_english: "Neon City", language: "C#", word_translated: "Night skyline glowing…" },
  { id: 5, image_url: "https://picsum.photos/seed/e/600/400", word_english: "Snow Ridge", language: "PYTHON", word_translated: "Crisp alpine ridge…" },
  { id: 6, image_url: "https://picsum.photos/seed/f/600/400", word_english: "Sea Cliff", language: "GO", word_translated: "Cliff over a calm sea…" },
];

type Item = typeof likesData[number];

export default function GalleryPage() {
  const [tab, setTab] = useState<"likes" | "history">("likes");
  const [history, setHistory] = useState([])
  const [data, setData] = useState(tab === "likes" ? likesData : history);
  // const data = tab ==="likes" ? likesData : historyData;

  const cardsPerRow = 3;
  const maxRows = 2;
  const cardsPerPage = cardsPerRow * maxRows; // 6 per page
  const [selected, setSelected] = useState<Item | null>(null);
  const [page, setPage] = useState(1);
  const [canNext, setNext] = useState(true);
  const [canPrev, setPrev] = useState(true);
  const [totalPages, setTotalPages] = useState(1)

  const request_info = async() => {
    const response = await fetch(import.meta.env.VITE_SERVER_URL + "/get_user_history?page=" + page, {
      method: "GET",
      credentials: 'include'
    })
    .then(function(response) { return response.json(); },
      function(reason) { window.alert("An issue occured when attempting to connect to the server"); console.log(reason)}
    )
    .then(function(json) {
      // use the json
      let likesHistory = []
      let history = []
      for (let i = 0; i < json.history.length; i++){
        json.history[i].key = i;
        if (json.history[i].is_favorite == true){
          likesHistory.push(json.history[i])
        }
        if (json.history[i].is_favorite == false){
          history.push(json.history[i])
        }
      }
    
      setHistory(json.history)
      setData(tab === "likes" ? likesHistory  : history)
      setNext(json.next_page_url.length > 0)
      setPrev(json.previous_page_url.length > 0)
      setTotalPages(json.max_page) 
      // console.log("DATA")
      // console.log(data);
    },
    function() {
      return
    }
  );
  }

  useEffect(() => {
    request_info();
  }, [tab, page])


  // return (
  //   <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
  //     <div className="text-center">
  //       <CardMenu tab={tab} onChange={tabMaking} />
  //     </div>
  // Pagination settings (fixed layout)

  // const totalPages = Math.ceil(data.length / cardsPerPage);
  // const start = page * cardsPerPage;
  // const end = start + cardsPerPage;
  // const pageData = data.slice(start, end);
  const pageData = data

  // const canPrev = page > 1;
  // const canNext = page < totalPages - 1;
  const goFirst = () => setPage(1);
  const goLast = () => setPage(totalPages);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* menu */}
      <div className="text-center">
        <CardMenu
          tab={tab}
          onChange={(newTab) => {
            setTab(newTab);
            setPage(1); // reset when switching tabs
          }}
        />
      </div>

      {/* gallery */}
      <div className="relative">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageData.map((item, i) => (
            <ImageFlipCard
              // Use a stable unique key (ids repeat in your array)
              // key={`${start + i}-${item.id}`}
              key={`${i}-${item.id}`}
              image={import.meta.env.VITE_SERVER_URL + "/media/" + item.image_url}
              word={item.word_english}
              lan={item.language}
              details={item.word_translated}
              onDetails={() => setSelected(item)}
            />
          ))}
        </div>

        {/* pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={goFirst}
              disabled={!canPrev}
              aria-label="First page"
              className="rounded-full border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              First
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev}
              aria-label="Previous page"
              className="rounded-full border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              ◀
            </button>

            <span className="mx-2 text-gray-600 text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!canNext}
              aria-label="Next page"
              className="rounded-full border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-40"
            >
             ▶
            </button>
            <button
              onClick={goLast}
              disabled={!canNext}
              aria-label="Last page"
              className="rounded-full border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              Last
            </button>
          </div>
        )}
      </div>

      {/* modal */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <img src={import.meta.env.VITE_SERVER_URL + "/media/" + selected.image_url} alt={selected.word_english} className="h-20 w-28 rounded object-cover" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selected.word_english}</h2>
                <p className="text-sm text-gray-500">{selected.language}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{selected.word_translated || "No additional details."}</p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
              <button
                className="rounded-lg px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => window.location.replace(import.meta.env.VITE_REDIRECT_URL + "user/userhistory/" + selected.id)}
              >
                Go to details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
