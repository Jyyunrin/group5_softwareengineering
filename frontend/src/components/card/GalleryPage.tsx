/**
 * Card component for Likes and History
 * Shows image cards with word, language, translation and basic pagination
 * Paired with ImageFlipCard.tsx
 */
import { useEffect, useState } from "react";
import CardMenu from "./CardMenu";
import ImageFlipCard from "./ImageFlipCard";

type Tab = "likes" | "history";

type Item = {
  id: number;
  image_url: string;
  word_english: string;
  language: string;
  word_translated: string;
  is_favorite: boolean;
};

type ApiResponse = {
  history: Item[];
  next_page_url: string | null;
  previous_page_url: string | null;
  max_page: number;
};

export default function GalleryPage() {
  const [tab, setTab] = useState<Tab>("history");
  const [history, setHistory] = useState<Item[]>([]);
  const [data, setData] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [canNext, setNext] = useState(false);
  const [canPrev, setPrev] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // error and loading flags
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // fetch history for current page and tab
  const request_info = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/get_user_history?page=${page}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const json = (await res.json()) as ApiResponse;

      const allHistory = json.history ?? [];
      const likesHistory: Item[] = [];
      const nonLikesHistory: Item[] = [];

      // split into liked vs non-liked lists
      for (let i = 0; i < allHistory.length; i++) {
        const item = allHistory[i];
        if (item.is_favorite) {
          likesHistory.push(item);
        } else {
          nonLikesHistory.push(item);
        }
      }

      // store full history (current page only)
      setHistory(allHistory);

      // show data based on current tab
      setData(tab === "likes" ? likesHistory : nonLikesHistory);

      // update pagination flags
      setNext(!!json.next_page_url);
      setPrev(!!json.previous_page_url);
      setTotalPages(json.max_page || 1);
    } catch (err) {
      console.error("Error fetching user history:", err);
      setErrorMsg("An issue occurred while loading your history.");

      // reset state on error
      setHistory([]);
      setData([]);
      setNext(false);
      setPrev(false);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // re-fetch when tab or page changes
  useEffect(() => {
    request_info();
  }, [tab, page]);

  // data to render for the grid
  const pageData = data;

  // jump to first page
  const goFirst = () => setPage(1);

  // jump to last page
  const goLast = () => setPage(totalPages);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* tab menu (likes / history) */}
      <div className="text-center">
        <CardMenu
          tab={tab}
          onChange={(newTab) => {
            setTab(newTab);
            setPage(1); // reset page when switching tab
          }}
        />
      </div>

      {/* error banner */}
      {errorMsg && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {errorMsg}
        </div>
      )}

      {/* gallery grid */}
      <div className="relative">
        {/* overlay loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
            <p className="text-sm text-gray-500">Loading…</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* empty state when no data */}
          {pageData.length === 0 && !loading ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-400 text-lg font-medium">
                {tab === "likes"
                  ? "You haven't liked anything yet."
                  : "You have no search history."}
              </p>
            </div>
          ) : (
            pageData.map((item, i) => (
              <ImageFlipCard
                key={`${i}-${item.id}`}
                image={`${import.meta.env.VITE_SERVER_URL}/media/${item.image_url}`}
                word={item.word_english}
                lan={item.language}
                details={item.word_translated}
                onDetails={() => setSelected(item)}
              />
            ))
          )}
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

      {/* details modal when a card is selected */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          {/* modal content */}
          <div
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/media/${selected.image_url}`}
                alt={selected.word_english}
                className="h-20 w-28 rounded object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selected.word_english}
                </h2>
                <p className="text-sm text-gray-500">{selected.language}</p>
              </div>
            </div>

            <p className="mt-4 text-gray-700">
              {selected.word_translated || "No additional details."}
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
              <button
                className="rounded-lg px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
                onClick={() =>
                  window.location.replace(
                    `${import.meta.env.VITE_REDIRECT_URL}user/userhistory/${selected.id}`
                  )
                }
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
