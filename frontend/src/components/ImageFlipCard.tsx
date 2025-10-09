/**
 * Backside of the card component for the landing page(homepage).
 * When a user clicks a card image, the card will be fliped and shows corresponding letters.
 * 
 */
import { useState } from "react";

export default function ImageFlipCard({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={() => setFlipped((v) => !v)}
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
        <div
          className="
            absolute inset-0 [backface-visibility:hidden]
          "
        >
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* back */}
        <div
          className="
            absolute inset-0 flex items-center justify-center
            rounded-2xl bg-white p-6 text-center
            [transform:rotateY(180deg)] [backface-visibility:hidden]
            border border-gray-200
          "
        >
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
    </button>
  );
}
