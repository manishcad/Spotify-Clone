'use client';

import { createContext, useContext, useState, useRef } from 'react';

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => useContext(MusicPlayerContext);

export const MusicPlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [albumCover, setAlbumCover] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentSong = songs[currentSongIndex];

  const play = async (newSong, songList = [], coverImage, index) => {
    console.log("Playing song:", newSong);
    setAlbumCover(coverImage);
    setCurrentSongIndex(index);
    setIsVisible(true);
    setIsPlaying(true);
  
    if (!newSong || !audioRef.current) return;
  
    console.log("Playing song:", {
      songName: newSong.songName,
      musicLink: newSong.musicLink
    });
  
    try {
      // Stop current playback if any
      if (audioRef.current.src) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
  
      setSongs(songList);
      
      // Set new song source
      audioRef.current.src = newSong.musicLink;
  
      // Try playing immediately
      const playAttempt = audioRef.current.play();
  
      if (playAttempt !== undefined) {
        playAttempt
          .then(() => {
            console.log("Playback started successfully!");
          })
          .catch((error) => {
            console.error("Playback failed. Waiting for load event...", error);
  
            // If play fails, wait for metadata to load, then try again
            audioRef.current.onloadeddata = async () => {
              try {
                await audioRef.current.play();
                setIsPlaying(true);
              } catch (error) {
                console.error("Error playing song:", error);
                setIsPlaying(false);
              }
            };
          });
      }
    } catch (error) {
      console.error("Error playing song:", error);
      setIsPlaying(false);
    }
  };
  
  

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const playNext = () => {
    console.log("Playing next song look here");
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const value = {
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
    setIsPlaying,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
