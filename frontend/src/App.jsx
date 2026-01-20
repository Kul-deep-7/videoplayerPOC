import { useRef } from 'react'

import VideoJS from './VideoJS'

function App() {
  const playerRef = useRef(null)
  const videoLink = "http://localhost:8000/uploads/courses/3d30fef0-6777-4496-88ed-3ab0bde64250/index.m3u8"

  const videoPlayerOptions ={
    controls : true,
    responsive : true,
    fluid : true,
    sources : [
      {
        src: videoLink,
        type: "application/x-mpegURL"
      }
    ]
  }
   const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <>
      <div>
        <h1>Video Player</h1>
      </div>
      <VideoJS
      options={videoPlayerOptions}
      onReady={handlePlayerReady}
      />
    </>
  )
}

export default App
