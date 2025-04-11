'use client';

import { useState, useRef, useEffect } from 'react';
import { useMusicPlayer } from '../../context/NewContext';

const MusicPlayer = () => { 
  const {
    audioRef,
    songs,
    setSongs,
    currentSong,
    currentSongIndex,
    setCurrentSongIndex,
    isPlaying,
    play,
    pause,
    playNext,
    playPrev,
    isMinimized,
    setIsMinimized,
    isVisible,
    setIsVisible,
    volume,
    setVolume,
    albumCover,
    setAlbumCover,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    updateTime,
    setIsPlaying,}=useMusicPlayer()
 
 
  

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playPreviousSong = () => {
    const newIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
  };

  const playNextSong = () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
  };

  const updateTimeElapsed = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleTimeSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
    if (isPlaying) audioRef.current.play();
  };

  useEffect(() => {
    setAlbumCover(albumCover)
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex]);

  

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 top-15 max-w-sm mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-xl ">
      {/* Top Buttons */}
      <div className="absolute top-2 left-2 flex gap-2">
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="bg-yellow-400 w-4 h-4 rounded-full hover:scale-110 transition"
          title="Minimize"
        />
      </div>
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setIsVisible(false)}
          className="bg-red-500 w-4 h-4 rounded-full hover:scale-110 transition"
          title="Close"
        />
      </div>

      {/* Minimized View */}
      {isMinimized ? (
        <div className="flex items-center justify-between space-x-4">
          <img
            src={albumCover?albumCover:"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/eb777e7a-7d3c-487e-865a-fc83920564a1/d7kpm65-437b2b46-06cd-4a86-9041-cc8c3737c6f0.jpg/v1/fill/w_800,h_800,q_75,strp/no_album_art__no_cover___placeholder_picture_by_cmdrobot_d7kpm65-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6IlwvZlwvZWI3NzdlN2EtN2QzYy00ODdlLTg2NWEtZmM4MzkyMDU2NGExXC9kN2twbTY1LTQzN2IyYjQ2LTA2Y2QtNGE4Ni05MDQxLWNjOGMzNzM3YzZmMC5qcGciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.8yjX5CrFjxVH06LB59TpJLu6doZb0wz8fGQq4tM64mg"}
            alt="album"
            className="w-12 h-12 rounded-full object-cover border border-gray-600"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold truncate">{currentSong?.songName || 'Loading...'}</p>
            <div className="text-xs text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</div>
          </div>
          <button onClick={togglePlay} className="text-white">
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      ) : (
        <>
          {/* Album Art */}
          <div className="mb-4 rounded-full overflow-hidden h-64 w-64 bg-gray-700 border-4 border-gray-700 shadow-lg mx-auto">
            <img
              src={albumCover}
              alt="album art"
              className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
              style={{ animationDuration: '20s' }}
            />
          </div>

          {/* Song Info */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">{currentSong?.songName}</h2>
            <p className="text-gray-400">{"artist"}</p>
          </div>

          {/* Time Slider */}
          <div className="w-full mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleTimeSeek}
              className="w-full accent-purple-500 cursor-pointer h-2 rounded-lg appearance-none bg-gray-700"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <button onClick={playPreviousSong} className="text-gray-300 hover:text-white p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>

            <button onClick={togglePlay} className="bg-purple-600 rounded-full p-4 hover:bg-purple-700">
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>

            <button onClick={playNextSong} className="text-gray-300 hover:text-white p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center w-full space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-purple-500 cursor-pointer h-2 rounded-lg appearance-none bg-gray-700"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
        </>
      )}

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong?.musicLink}
        onTimeUpdate={updateTimeElapsed}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNextSong}
      />
    </div>
  );
};

export default MusicPlayer;
