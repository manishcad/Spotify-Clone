// components/MusicPlayer.jsx
"use client"
import { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, 
  Repeat, Volume2, Maximize2, Minimize2, Heart
} from 'lucide-react';
import { useMusicPlayer } from '../../context/NewContext'; // Update this path

const MusicPlayer = () => {
  // Use the global context instead of local state
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    play,
    pause,
    playNext,
    playPrev,
    isMinimized,
    setIsMinimized,
    isVisible,
    volume,
    setVolume,
    albumCover,
    currentTime,
    duration,
    audioRef,
    updateTime
  } = useMusicPlayer();

  // Format time for display (convert seconds to MM:SS format)
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentSong) {
        setIsPlaying(true);
        audioRef.current?.play();
      }
    }
  };

  // Toggle minimize/maximize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Update currentTime when the audio is playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => updateTime();
    const handleLoadedMetadata = () => {
      updateTime();
      if (audio.duration) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioRef, updateTime]);

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle seek on progress bar click
  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPosition * duration;
    
    if (audioRef.current && !isNaN(seekTime)) {
      audioRef.current.currentTime = seekTime;
      updateTime();
    }
  };

  // If player is not visible, don't render anything
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-700 transition-all duration-300 ${
        isMinimized ? 'h-12' : 'h-20'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Track info section */}
        <div className="flex items-center gap-3 w-1/4">
          {!isMinimized && currentSong && (
            <div className="h-12 w-12 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
              <img 
                src={albumCover || '/default-album-cover.jpg'} 
                alt="Album cover" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/48/48";
                }}
              />
            </div>
          )}
          <div className="truncate">
            <p className="text-white text-sm font-medium truncate">
              {currentSong?.songName || 'No song selected'}
            </p>
            {!isMinimized && currentSong && (
              <p className="text-zinc-400 text-xs">
                {currentSong?.artistName || 'Unknown Artist'}
              </p>
            )}
          </div>
          {!isMinimized && (
            <Heart 
              size={18} 
              className="text-white cursor-pointer hover:text-red-500 transition-colors" 
            />
          )}
        </div>

        {/* Controls section */}
        <div className="flex flex-col items-center justify-center w-2/4">
          {/* Playback controls */}
          <div className="flex items-center gap-4">
            <Shuffle size={16} className="text-zinc-400 hover:text-white cursor-pointer" />
            <SkipBack 
              size={20} 
              className="text-white cursor-pointer"
              onClick={playPrev} 
            />
            <button 
              onClick={togglePlayPause}
              className="bg-white rounded-full p-1 hover:bg-zinc-200 transition-colors"
              disabled={!currentSong}
            >
              {isPlaying ? 
                <Pause size={18} className="text-black" /> : 
                <Play size={18} className="text-black" />
              }
            </button>
            <SkipForward 
              size={20} 
              className="text-white cursor-pointer"
              onClick={playNext}
            />
            <Repeat size={16} className="text-zinc-400 hover:text-white cursor-pointer" />
          </div>

          {/* Progress bar (hide when minimized) */}
          {!isMinimized && (
            <div className="w-full flex items-center gap-2 mt-2">
              <span className="text-xs text-zinc-400">{formatTime(currentTime)}</span>
              <div 
                className="h-1 flex-grow bg-zinc-700 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-white rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Volume and additional controls */}
        <div className="flex items-center justify-end gap-4 w-1/4">
          {!isMinimized && (
            <div className="flex items-center gap-2">
              <Volume2 size={18} className="text-white" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 appearance-none bg-zinc-700 rounded-full outline-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, white ${volume * 100}%, #3f3f46 ${volume * 100}%)`
                }}
              />
            </div>
          )}
          <button onClick={toggleMinimize} className="text-white">
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
        </div>
      </div>
      
      {/* Audio element (hidden) */}
      <audio 
        ref={audioRef}
        onEnded={playNext}
      />
    </div>
  );
};

export default MusicPlayer;