/**
 * Likes / History Menu container for the row 3, the landing page(homepage).
 * 
 */

type Tab = "likes" | "history";

export default function CardMenu({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <div className="w-full">
      <div className="flex justify-center gap-6 px-4 py-3">
        <button
          className={`text-sm font-medium ${
            tab === "likes"
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => onChange("likes")}
        >
          Likes
        </button>
        <button
          className={`text-sm font-medium ${
            tab === "history"
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => onChange("history")}
        >
          Search History
        </button>
      </div>

      {/* Grey divider row */}
      <div className="h-[1px] w-full bg-gray-200" />
    </div>
  );
}
