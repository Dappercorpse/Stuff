import { useState, useRef, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import  songs  from './data/songs.json';
import { Container } from './components/container';
import { Header } from './components/header';
import { Player } from './components/player';
import { removeFromQueue, addToQueue, playNext } from './utils/queue.js';
import pauseImage from './assets/images/pause-button.svg';
import playImage from './assets/images/play-button.svg';
import './styles/container.css';
import './styles/header.css';
import './styles/player.css';

function App() {
  let [isPlaying, setIsPlaying] = useState(false);
  let [currentIndex, setCurrentIndex] = useState(0);
  let [query, setQuery] = useState('');
  let [queue, setQueue] = useState([songs[0].id]);
  let [position, setPosition] = useState(0);
  let song = songs.find((s) => s.id === queue[position]);
  let audioRef = useRef(null);
  let queueNumber=queue.length;

  window.addEventListener('keydown', (event) => {
    if(event.key==='SpaceBar'){
      event.
      togglePlay();
    }
  })

  function selectSong(id) {
    if (id === queue[position]) {
      togglePlay();
    } else {
      setPosition(0);
      setQueue([id]);
      setIsPlaying(true);
    }
  }

  function selectSong2(id){
    if (id === queue[position]){
      togglePlay();
    }
    else{
      let i=queue.findIndex((x) => x === id);
      setPosition(i);
      setIsPlaying(true);
    }
  }

  function togglePlay() {
    let audio = audioRef.current;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function nextSong() {
    if (position < queue.length - 1) {
      setPosition(position + 1);
    }
  }

  function prevSong() {
    if (position > 0) {
      setPosition(position - 1);
    }
  }

  function queueNext(id) {
    setQueue(playNext(id, queue, position));
  }

  function queueLast(id) {
    setQueue(addToQueue(id, queue));
  }

  function queueRemove(id) {
    setQueue(removeFromQueue(id, queue));
  }

  let queueSongs = queue.map((id) => songs.find((s) => s.id === id)).filter(Boolean);
  let currentId = queue[position];

useEffect(function () {
    function handleKey(event) {
        if (event.key === ' ' && event.target.tagName !== 'INPUT') {
            togglePlay();
        }
    }

    window.addEventListener('keydown', handleKey);
    return function () {
        window.removeEventListener('keydown', handleKey);
    };
}, []);
  useEffect(function () {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
          audioRef.current.play();
      }
  }, [position]);

  useEffect(function () {
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentId, isPlaying]);

  return (
    <>
      <Header queueNumber={queueNumber}/>

      <Routes>
        <Route
          path='/'
          element={
            <Container
              songs={songs}
              isPlaying={isPlaying}
              onSelect={selectSong}
              currentIndex={currentIndex}
              query={query}
              setQuery={setQuery}
              onAddToQueue={queueLast}
              onPlayNext={queueNext}
              onRemove={queueRemove}
              inQueue={false}
              currentId={currentId}
            />
          }
        />

        <Route
          path='/queue'
          element={
            <Container
              songs={queueSongs}
              isPlaying={isPlaying}
              onSelect={selectSong2}
              currentIndex={currentIndex}
              query={query}
              setQuery={setQuery}
              onAddToQueue={queueLast}
              onPlayNext={queueNext}
              onRemove={queueRemove}
              inQueue={true}
              currentId={currentId}
            />
          }
        />
      </Routes>

      <Player
        song={song}
        audioRef={audioRef}
        isPlaying={isPlaying}
        onToggle={togglePlay}
        onNext={nextSong}
        onPrev={prevSong}
      />
    </>
  );
}

export default App;