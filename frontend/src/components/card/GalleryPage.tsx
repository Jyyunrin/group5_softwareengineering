/**
 * Likes and Search History for the row 3, landing page(homepage) 
 * This component shows the data
 * Paired with ImageFlipCard.tsx
 * 
 * 
 * TODO:
 * Implement likes, history data instead of hardcoded one
 * setSelected -> link
 * Carousel?
 * Arrow button renewal 
 */
import { useState } from "react";
import CardMenu from "./CardMenu";
import ImageFlipCard from "./ImageFlipCard";

const likesData = [
  { id: 1, image: "https://picsum.photos/seed/a/600/400", word: "Sunset Dune", lan: "C", details: "Warm dunes at dusk…" },
  { id: 2, image: "https://picsum.photos/seed/b/600/400", word: "River Stone", lan: "ELIXIR", details: "Smooth river stones…" },
  { id: 3, image: "https://picsum.photos/seed/c/600/400", word: "Forest Path", lan: "JAVA", details: "Shaded path through pines…" },
  { id: 7, image: "https://picsum.photos/seed/g/600/400", word: "Golden Field", lan: "JS", details: "Grassy fields under sun…" },
  { id: 8, image: "https://picsum.photos/seed/h/600/400", word: "Stone Bridge", lan: "RUST", details: "Bridge across small creek…" },
  { id: 9, image: "https://picsum.photos/seed/i/600/400", word: "Lava Flow", lan: "C++", details: "Molten lava at night…" },
  { id: 10, image: "https://picsum.photos/seed/j/600/400", word: "Aurora Sky", lan: "SWIFT", details: "Dancing lights above ice…" },
  { id: 1, image: "https://picsum.photos/seed/a/600/400", word: "Sunset Dune", lan: "C", details: "Warm dunes at dusk…" },
  { id: 2, image: "https://picsum.photos/seed/b/600/400", word: "River Stone", lan: "ELIXIR", details: "Smooth river stones…" },
  { id: 3, image: "https://picsum.photos/seed/c/600/400", word: "Forest Path", lan: "JAVA", details: "Shaded path through pines…" },
  { id: 7, image: "https://picsum.photos/seed/g/600/400", word: "Golden Field", lan: "JS", details: "Grassy fields under sun…" },
  { id: 8, image: "https://picsum.photos/seed/h/600/400", word: "Stone Bridge", lan: "RUST", details: "Bridge across small creek…" },
  { id: 9, image: "https://picsum.photos/seed/i/600/400", word: "Lava Flow", lan: "C++", details: "Molten lava at night…" },
  { id: 10, image: "https://picsum.photos/seed/j/600/400", word: "Aurora Sky", lan: "SWIFT", details: "Dancing lights above ice…" },
  { id: 1, image: "https://picsum.photos/seed/a/600/400", word: "Sunset Dune", lan: "C", details: "Warm dunes at dusk…" },
  { id: 2, image: "https://picsum.photos/seed/b/600/400", word: "River Stone", lan: "ELIXIR", details: "Smooth river stones…" },
  { id: 3, image: "https://picsum.photos/seed/c/600/400", word: "Forest Path", lan: "JAVA", details: "Shaded path through pines…" },
  { id: 7, image: "https://picsum.photos/seed/g/600/400", word: "Golden Field", lan: "JS", details: "Grassy fields under sun…" },
  { id: 8, image: "https://picsum.photos/seed/h/600/400", word: "Stone Bridge", lan: "RUST", details: "Bridge across small creek…" },
  { id: 9, image: "https://picsum.photos/seed/i/600/400", word: "Lava Flow", lan: "C++", details: "Molten lava at night…" },
  { id: 10, image: "https://picsum.photos/seed/j/600/400", word: "Aurora Sky", lan: "SWIFT", details: "Dancing lights above ice…" },
];

const historyData = [
  { id: 4, image: "https://picsum.photos/seed/d/600/400", word: "Neon City", lan: "C#", details: "Night skyline glowing…" },
  { id: 5, image: "https://picsum.photos/seed/e/600/400", word: "Snow Ridge", lan: "PYTHON", details: "Crisp alpine ridge…" },
  { id: 6, image: "https://picsum.photos/seed/f/600/400", word: "Sea Cliff", lan: "GO", details: "Cliff over a calm sea…" },
];

type Item = typeof likesData[number];

export default function GalleryPage() {
  const [tab, setTab] = useState<"likes" | "history">("likes");
  const data = tab === "likes" ? likesData : historyData;

  const [selected, setSelected] = useState<Item | null>(null);

  // Pagination settings (fixed layout)
  const cardsPerRow = 3;
  const maxRows = 4;
  const cardsPerPage = cardsPerRow * maxRows; // 12 per page

  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(data.length / cardsPerPage);
  const start = page * cardsPerPage;
  const end = start + cardsPerPage;
  const pageData = data.slice(start, end);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;
  const goFirst = () => setPage(0);
  const goLast = () => setPage(totalPages - 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* menu */}
      <div className="text-center">
        <CardMenu
          tab={tab}
          onChange={(newTab) => {
            setTab(newTab);
            setPage(0); // reset when switching tabs
          }}
        />
      </div>

      {/* gallery */}
      <div className="relative">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageData.map((item, i) => (
            <ImageFlipCard
              // Use a stable unique key (ids repeat in your array)
              key={`${start + i}-${item.id}`}
              image={item.image}
              word={item.word}
              lan={item.lan}
              details={item.details}
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
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={!canPrev}
              aria-label="Previous page"
              className="rounded-full border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              ◀
            </button>

            <span className="mx-2 text-gray-600 text-sm">
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
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
              <img src={selected.image} alt={selected.word} className="h-20 w-28 rounded object-cover" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selected.word}</h2>
                <p className="text-sm text-gray-500">{selected.lan}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{selected.details || "No additional details."}</p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
              <button
                className="rounded-lg px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setSelected(null)}
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
