import { useState } from 'react';
import pauseImage from '../assets/images/pause-button.svg';
import playImage from '../assets/images/play-button.svg';

export function Player({ song, isPlaying, audioRef, onToggle, onNext, onPrev }) {
  let [currentTime, setCurrentTime] = useState(0);
  let [duration, setDuration] = useState(0);

  function formatTime(seconds) {
    if (!seconds) return '0:00';
    let minutes = Math.floor(seconds / 60);
    let rest = Math.floor(seconds % 60);
    return minutes + ':' + (rest < 10 ? '0' + rest : rest);
  }

  function seek(e) {
    audioRef.current.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  }

  return (
    <div className='player js-player'>
      <div className='nowPlaying1'>
        <div className='playingTitle'>{song.title}</div>
        <div className='artist'>{song.artist}</div>
      </div>

      <div className='nowPlaying2'>
        <button className='playerButton' onClick={onToggle}>
          <img className='playerImage2' src={isPlaying ? pauseImage : playImage} alt='' />
        </button>
      </div>

      <div className='nowPlaying3'>
        <div className='seekRow'>
          <input
            type='range'
            className='progress'
            min='0'
            max={duration || 0}
            step='0.1'
            value={currentTime}
            onChange={seek}
          />
          <span className='time'>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>

        <div className='skipRow'>
          <button className='playerButton prevButton' onClick={onPrev}>
            <svg width='16' height='16' viewBox='0 0 24 24'>
              <rect x='4' y='5' width='3' height='14' fill='white' />
              <polygon points='20,5 20,19 8,12' fill='white' />
            </svg>
          </button>

          <button className='nextButton' onClick={onNext}>
            <svg width='16' height='16' viewBox='0 0 24 24'>
              <rect x='17' y='5' width='3' height='14' fill='white' />
              <polygon points='4,5 4,19 16,12' fill='white' />
            </svg>
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={song.src}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={onNext}
      />
    </div>
  );
}