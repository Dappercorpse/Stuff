import { useState } from 'react';
import pauseImage from '../assets/images/pause-button.svg';
import playImage from '../assets/images/play-button.svg';
import { removeFromQueue } from '../utils/queue';

export function MusicContainer({
  songs,
  currentIndex,
  isPlaying,
  onSelect,
  query,
  onAddToQueue,
  onPlayNext,
  onRemove,
  inQueue,
  currentId
}) {
  let [menu, setMenu] = useState(null);

  function openMenu(e, id) {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, id: id });
  }

  let q = query.toLowerCase();
  let shown = songs.filter((song) => {
    return (
      song.title.toLowerCase().includes(q) ||
      song.album.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q)
    );
  });

  let rows = shown.map((song, index) => (
    <div
      onContextMenu={(e) => openMenu(e, song.id)}
      className={song.id === currentId ? 'songRow js-song-row playing' : 'songRow js-song-row'}
      key={song.id}
    >
      <span className='titleCell'>{song.title}</span>
      <button className='playButton js-play-button' onClick={() => { onSelect(song.id) }}>
        <img
          className='play'
          src={song.id === currentId && isPlaying ? pauseImage : playImage}
          alt=''
        />
      </button>
      <span>{song.duration}</span>
      <span>{song.artist}</span>
      <span>{song.album}</span>
      <span>{song.date}</span>
    </div>
  ));

  return (
    <>
      <div className='songList'>{rows}</div>

      {menu && (
        <>
          <div
            className='overlay'
            onClick={() => setMenu(null)}
            onContextMenu={(e) => { e.preventDefault(); setMenu(null); }}
          ></div>

          <div
            className='context'
            style={{ top: menu.y, left: menu.x }}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className='contextItem addToQueue' onClick={() => { onAddToQueue(menu.id); setMenu(null); }}>
              Add to Queue
            </div>
            <div className='contextItem playNext' onClick={() => { onPlayNext(menu.id); setMenu(null); }}>
              Play Next
            </div>
            {inQueue && (
              <div className='contextItem removeFromQueue' onClick={() => { onRemove(menu.id); setMenu(null); }}>
                Remove From Queue
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export function Container({
  songs,
  currentIndex,
  isPlaying,
  onSelect,
  onToggle,
  query,
  setQuery,
  onAddToQueue,
  onPlayNext,
  onRemove,
  inQueue,
  currentId
}) {
  return (
    <div className='cunt js-cunt'>
      <div className='searchBar js-search-bar'>
        <input
          type='search'
          className='searchBar js-search-bar'
          placeholder='Search title, artist or album'
          onChange={(event) => setQuery(event.target.value)}
          value={query}
        />
      </div>

      <div className='songHead'>
        <span>Title</span>
        <span></span>
        <span>Duration</span>
        <span>Artist</span>
        <span>Album</span>
        <span>Year</span>
      </div>

      <MusicContainer
        songs={songs}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onSelect={onSelect}
        query={query}
        onAddToQueue={onAddToQueue}
        onPlayNext={onPlayNext}
        onRemove={onRemove}
        inQueue={inQueue}
        currentId={currentId}
      />
    </div>
  );
}