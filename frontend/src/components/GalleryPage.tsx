/**
 * Likes and Search History for the row 3, landing page(homepage) 
 * This component shows the data
 * 
 * 
 * TODO:
 * Implement likes, history data instead of hardcoded one
 */
import { useState } from "react";
import CardMenu from "./CardMenu";
import ImageFlipCard from "./ImageFlipCard";

const likesData = [
  { id: 1, image: "https://picsum.photos/seed/a/600/400", title: "Sunset Dune" },
  { id: 2, image: "https://picsum.photos/seed/b/600/400", title: "River Stone" },
  { id: 3, image: "https://picsum.photos/seed/c/600/400", title: "Forest Path" },
];

const historyData = [
  { id: 4, image: "https://picsum.photos/seed/d/600/400", title: "Neon City" },
  { id: 5, image: "https://picsum.photos/seed/e/600/400", title: "Snow Ridge" },
  { id: 6, image: "https://picsum.photos/seed/f/600/400", title: "Sea Cliff" },
];

export default function GalleryPage() {
  const [tab, setTab] = useState<"likes" | "history">("likes");
  const data = tab === "likes" ? likesData : historyData;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <CardMenu tab={tab} onChange={setTab} />

      {/* Image cards under the grey row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <ImageFlipCard key={item.id} image={item.image} title={item.title} />
        ))}
      </div>
    </div>
  );
}
