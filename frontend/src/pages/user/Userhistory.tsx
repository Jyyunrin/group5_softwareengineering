/**
 * This page displays user's likes and search history with pictures.
 */
import GalleryPage from '../../components/card/GalleryPage';

export default function UserHistory() {
  return (
    <div className="min-h-screen mx-auto w-full max-w-[1080px] bg-white">
        <section className="mt-7">
          <div className="mt-4">
            <GalleryPage />
          </div>
        </section>
    </div>
  );
}
