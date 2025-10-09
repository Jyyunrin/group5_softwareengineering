/**
 * This page displays user's likes and search history with pictures
 * 
 * TODO:
 * Connect with db
 * Make the menu text center aligned
 * When user clicks -> navigate ?
 */

import GalleryPage from '../components/GalleryPage';

function UserHistory() {
  return (
    <div className="min-h-screen mx-auto w-full max-w-[1080px] bg-white">
        {/* Likes / Search history */}
        <section className="mt-7">
          {/* text-center doesn't work... */}
          <div className="mt-4">
            <GalleryPage />
          </div>
        </section>
    </div>
  );
}

export default UserHistory;
