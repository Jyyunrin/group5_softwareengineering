/**
 * Landing page(homepage) after log-in
 * 
 * Todo: organize margin
 */
import './landing.css';
import Card from './components/Cards';
import GalleryPage from './components/GalleryPage';

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
       
      
        {/* Row2. Target language */}
        <div className="flex">
          Target Language
        </div>
      </div>

    </div>

    {/* Col2. Quiz */}
    <div className="bg-green-400 flex-1 flex">
      {/* testing grid */}
      <div className="flex justify-center"> 
        <Card
          image="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRt_QiKPVzqfwTyHlXu7n9qOb72v9TcdkCVh568x4mFTEhWX7K1Uum-ziPXkK75ZQM0SRLS8ySsQtFuB85WhAaOUPCYr8n3eUKW3BC91XHM"
          title="Quiz Time!"
          description="I know you already forgot most of words. Review right now you dumbo"
        >
          <button className="mt-2 px-3 py-1">
            {/* Google Icon */}
            <span className="material-symbols-outlined">
              motion_play
            </span>
          </button>
        </Card>
      </div>
    </div>

    {/* Col3. Likes / Search History */}
    <div className="bg-blue-400 h-24">
      Row 3
      {/* gallerypage */}
      <GalleryPage></GalleryPage>
    </div>
  </div>
  )
}

export default Landing
