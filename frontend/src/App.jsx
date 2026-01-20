import { useRef } from 'react'
import './App.css'
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

  return (
    <>
    
    </>
  )
}

export default App
