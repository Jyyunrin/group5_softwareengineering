/**
 * Landing page(homepage) after log-in
 * 
 * Todo: 
 * Populate dynamic data for username, quiz, search history...
 * Adjust max w for various screen size (current setting: 1080px)
 * 
 * 
 */
import './landing.css';
import Card from './components/card/Cards';
import GalleryPage from './components/card/GalleryPage';
import Logout from './components/Logout';

function Landing() {
  return (
  <div className="flex flex-col h-screen">
    {/* Col1. Greetings */}
    <div className="bg-red-400 h-20">
      Ola, <br></br>
      Username!
      
      <div className="flex flex-row h-screen justify-between">
        {/* Row1. Quick guide */}
        <div className="flex">
          Quick Guide
        </div>
      
        <div className="absolute top-4 right-4 z-50">
          <Logout />
        </div>

        {/* Row2. Target language */}
        <div className="flex">
          Target Language
        </div>
      </div>
      <main>
        <section>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
            {/* Connect to quick guid page */}
            <button className="inline-flex items-center gap-1">
              Quick Guide <span aria-hidden>→</span>
            </button>

            {/* Dynamic data needed */}
            <button className="inline-flex items-center gap-2">
              <span>Target Language:</span>
              <span role="img" aria-label="Portuguese flag">🇵🇹</span>
              <span aria-hidden>✎</span>
            </button>
          </div>
        </section>

        {/* Quiz Card */}
        <section className="mt-6">
          <div className="overflow-hidden rounded-3xl bg-gray-100 shadow">
            <Card
              image="https://yt3.googleusercontent.com/8cgZMlfbExlkCdKjgJjxmHqa80xJ6WByNIbayrhS3AN3TbumcJO3TnujIq61nYh9vZWWMW7eUg=s900-c-k-c0x00ffffff-no-rj"
              title="Quiz Time!: Build Your Stack"
              description="I feel sleepy......I know you're also sleepy...."
            >
              <button
                className="mt-2 grid h-12 w-12 place-items-center rounded-full bg-gray-900 text-white"
                aria-label="Play"
              >
                ▶
              </button>
            </Card>
          </div>
        </section>

        {/* Likes / Search history */}
        <section className="mt-7">
          <div className="mt-4">
            <GalleryPage />
          </div>
        </section>
      </main>
    </div>
  </div>

  )
}

export default Landing;
