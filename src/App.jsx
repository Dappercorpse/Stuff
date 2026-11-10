import { useState, useRef, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { parseBlob } from 'music-metadata-browser';
import { Login } from './components/login.jsx';
import { supabase } from './supabase.js';
import { Container } from './components/container';
import { Header } from './components/header';
import { Player } from './components/player';

import { removeFromQueue, addToQueue, playNext } from './utils/queue.js';
import pauseImage from './assets/images/pause-button.svg';
import playImage from './assets/images/play-button.svg';
import './styles/container.css';
import './styles/header.css';
import './styles/player.css';

let junkPhrases = [
  '| HiphopKit.com',
  '- SongsLover.com',
];

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cleanTitle(title) {
  let cleaned = title;
  for (let junk of junkPhrases) {
    cleaned = cleaned.replace(new RegExp(escapeRegex(junk), 'gi'), '');
  }
  return cleaned.replace(/\s*[-|]\s*$/, '').trim();
}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let rest = Math.floor(seconds % 60);
  return minutes + ':' + (rest < 10 ? '0' + rest : rest);
}

async function toSongs(rows) {
  return Promise.all(rows.map(async (row) => {
    let { data } = await supabase.storage.from('music').createSignedUrl(row.file_path, 3600);
    return {
      id: row.id,
      title: row.title,
      artist: row.artist,
      album: row.album,
      date: row.date,
      duration: row.duration,
      src: data?.signedUrl,
    };
  }));
}

function App() {
  let [session, setSession] = useState(null);
  let [isPlaying, setIsPlaying] = useState(false);
  let [currentIndex, setCurrentIndex] = useState(0);
  let [query, setQuery] = useState('');
  let [queue, setQueue] = useState([]);
  let [songs, setSongs] = useState([]);
  let [position, setPosition] = useState(0);
  let [loading, setLoading] = useState(false);
  let [uploading, setUploading] = useState(false);

  async function loadSongs() {
    setLoading(true);
    let { data, error } = await supabase.from('songs').select('*');
    if (error) {
      console.log(error.message);
      setLoading(false);
      return;
    }
    setSongs(await toSongs(data));
    setLoading(false);
  }

  useEffect(function () {
    if (!session) return;
    loadSongs();
    let timer = setInterval(loadSongs, 50 * 60 * 1000);
    return function () {
      clearInterval(timer);
    };
  }, [session]);

  useEffect(function () {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    let { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
    });
    return function () {
      listener.subscription.unsubscribe();
    };
  }, []);

  let song = songs.find((s) => s.id === queue[position]);
  let audioRef = useRef(null);
  let queueNumber = queue.length;

  async function uploadSongs(files) {
    setUploading(true);
    for (let file of files) {
      try {
        let { data: userData } = await supabase.auth.getUser();
        let userId = userData.user.id;
        let path = userId + '/' + file.name;

        let { error: uploadError } = await supabase.storage.from('music').upload(path, file);
        if (uploadError) throw uploadError;

        let meta = await parseBlob(file);

        let { error: insertError } = await supabase.from('songs').insert({
          title: cleanTitle(meta.common.title || file.name.replace(/\.mp3$/i, '')),
          artist: meta.common.artist || 'Unknown',
          album: meta.common.album || 'Unknown',
          date: meta.common.year ? String(meta.common.year) : '',
          duration: formatTime(meta.format.duration),
          file_path: path,
        });
        if (insertError) throw insertError;
      } catch (error) {
        console.log('Upload failed for ' + file.name + ':', error.message ?? error);
      }
    }
    await loadSongs();
    setUploading(false);
  }

  async function deleteSong(id) {
    if (!window.confirm('Remove this song from your library?')) return;

    let { data: row, error } = await supabase.from('songs').select('file_path').eq('id', id).single();
    if (error) {
      console.log(error.message);
      return;
    }

    await supabase.storage.from('music').remove([row.file_path]);

    let { error: deleteError } = await supabase.from('songs').delete().eq('id', id);
    if (deleteError) {
      console.log(deleteError.message);
      return;
    }

    setQueue(removeFromQueue(id, queue));
    await loadSongs();
  }

  function selectSong(id) {
    if (id === queue[position]) {
      togglePlay();
    } else {
      setPosition(0);
      setQueue([id]);
      setIsPlaying(true);
    }
  }

  function selectSong2(id) {
    if (id === queue[position]) {
      togglePlay();
    }
    else {
      let i = queue.findIndex((x) => x === id);
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
    if (audioRef.current) audioRef.current.currentTime = 0;
    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [position]);

  useEffect(function () {
    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [currentId, isPlaying]);

  if (!session) return <Login />;

  return (
    <>
      <Header queueNumber={queueNumber} onUpload={uploadSongs} />
      {loading && <p className='status'>Loading songs...</p>}
      {uploading && <p className='status'>Uploading songs...</p>}

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
              onDeleteSong={deleteSong}
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
              onDeleteSong={deleteSong}
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