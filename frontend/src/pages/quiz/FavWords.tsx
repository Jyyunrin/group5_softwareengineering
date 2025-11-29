/**
 * A page with a list of favorite words.
 * This page is not activated. This feature can be added in the future.
 */
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

type FavWord = {
  id: string;
  srcLang: string;    
  srcText: string;    
  tgtLang: string;    
  tgtText: string;      
  addedAt: number; 
};

const LS_KEY = "fango:favourites:v1";

function loadFavourites(): FavWord[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as FavWord[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveFavourites(list: FavWord[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export function addFavourite(word: Omit<FavWord, "id" | "addedAt">) {
  const now = Date.now();
  const id = `${word.srcLang}:${word.srcText}__${word.tgtLang}:${word.tgtText}`.toLowerCase();
  const list = loadFavourites();

  // de-dupe: move to top if exists
  const filtered = list.filter((w) => w.id !== id);
  const next = [{ id, addedAt: now, ...word }, ...filtered];
  saveFavourites(next);
}

export default function FavouriteWords() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<FavWord[]>([]);

  useEffect(() => {
    const existing = loadFavourites();
    // Fallback
    if (existing.length === 0) {
      const seed: FavWord[] = [
        { id: "port:caneta__eng:pen", srcLang: "Port", srcText: "Caneta", tgtLang: "Eng", tgtText: "Pen", addedAt: Date.now() - 5000 },
        { id: "port:caderno__eng:notebook", srcLang: "Port", srcText: "Caderno", tgtLang: "Eng", tgtText: "Notebook", addedAt: Date.now() - 4000 },
        { id: "port:garrafa__eng:bottle", srcLang: "Port", srcText: "Garrafa", tgtLang: "Eng", tgtText: "Bottle", addedAt: Date.now() - 3000 },
      ];
      saveFavourites(seed);
      setItems(seed);
    } else {
      setItems(existing);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byRecency = [...items].sort((a, b) => b.addedAt - a.addedAt);
    if (!q) return byRecency;
    return byRecency.filter(
      (w) =>
        w.srcText.toLowerCase().includes(q) ||
        w.tgtText.toLowerCase().includes(q) ||
        w.srcLang.toLowerCase().includes(q) ||
        w.tgtLang.toLowerCase().includes(q)
    );
  }, [items, query]);

  const removeOne = (id: string) => {
    const next = items.filter((w) => w.id !== id);
    setItems(next);
    saveFavourites(next);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-5">
      {/* Top bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl bg-gray-100 pl-10 pr-3 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="mt-10 text-center text-gray-400">
          No favourites yet.
        </div>
      ) : (
        <ul className="space-y-3 pb-24">
          {filtered.map((w) => (
            <li key={w.id} className="rounded-full bg-gray-100 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Source chip + word */}
                  <span className="shrink-0 rounded-md bg-gray-800/90 text-white text-xs px-1.5 py-0.5">
                    {w.srcLang}
                  </span>
                  <span className="truncate text-2xl font-medium text-gray-900">
                    {w.srcText}
                  </span>
                </div>

                <div className="flex items-center gap-3 min-w-0">
                  {/* Target chip + word */}
                  <span className="shrink-0 rounded-md bg-gray-800/90 text-white text-xs px-1.5 py-0.5">
                    {w.tgtLang}
                  </span>
                  <span className="truncate text-2xl font-medium text-gray-400">
                    {w.tgtText}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeOne(w.id)}
                  className="ml-2 shrink-0 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
