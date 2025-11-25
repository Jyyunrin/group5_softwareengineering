/**
 * Backside of the card component for the landing page(homepage).
 * When a user clicks a card image, the card will be fliped and shows corresponding letters.
 * 
 * Paried with GalleryPage.tsx
 */
import { useState, type KeyboardEvent } from "react";

type Props = {
  image: string;
  lan: string;
  word: string;
  details: string;
  onDetails: () => void; 
};

export default function ImageFlipCard({ image, lan, word, details, onDetails }: Props) {
  const [flipped, setFlipped] = useState(false);

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped(v => !v);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={() => setFlipped(v => !v)}
      onKeyDown={handleKey}
      className="
        group relative w-full overflow-hidden rounded-2xl
        [perspective:1000px] outline-none focus:ring-2 focus:ring-blue-500
        transition-transform hover:-translate-y-1 active:translate-y-[1px]
      "
    >
      {/* card inner */}
      <div
        className={`
          relative h-56 w-full rounded-2xl shadow-md transition-transform duration-500
          [transform-style:preserve-3d] bg-white
          ${flipped ? '[transform:rotateY(180deg)]' : ''}
        `}
      >
        {/* front */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <img src={image} alt={word} className="h-full w-full object-cover" />
        </div>

        {/* back */}
        <div
          className="
            absolute inset-0 flex flex-col items-center justify-center space-y-2
            rounded-2xl bg-white p-6 text-center
            [transform:rotateY(180deg)] [backface-visibility:hidden]
            border border-gray-200
          "
        >
          <h3 className="text-lg font-semibold text-gray-900">{word}</h3>
          <p className="text-base text-gray-500">{lan}</p>
          <p className="text-sm text-gray-500 line-clamp-2">{details}</p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); 
              onDetails();
            }}
            className="
              mt-3 rounded-lg border border-gray-300 px-3 py-1.5 text-sm
              hover:bg-gray-50 active:bg-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          >
            View details
          </button>
        </div>
      </div>
    </div>
  );
}
