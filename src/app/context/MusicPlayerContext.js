"use client";
import { createContext, useState, useRef, useContext, useEffect } from "react";

const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
    const [song, setSong] = useState(null);
    const [songs, setSongs] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);

    useEffect(() => {
        // Create Audio object only on the client side
        audioRef.current = new Audio();
        
        // Set up event listeners
        const handleTimeUpdate = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
                setDuration(audioRef.current.duration);
            }
        };

        const handlePlay = () => {
            console.log("Audio play event fired");
            setIsPlaying(true);
        };

        const handlePause = () => {
            console.log("Audio pause event fired");
            setIsPlaying(false);
        };

        const handleEnded = () => {
            console.log("Audio ended event fired");
            setIsPlaying(false);
            setCurrentTime(0);
            // Auto-play next song if available
            if (songs.length > 0) {
                const currentIndex = songs.findIndex(s => s.musicLink === song?.musicLink);
                const nextIndex = (currentIndex + 1) % songs.length;
                playSong(songs[nextIndex], songs);
            }
        };

        const handleError = (error) => {
            console.error("Audio error:", error);
            console.error("Audio error details:", {
                error: audioRef.current?.error,
                src: audioRef.current?.src,
                readyState: audioRef.current?.readyState
            });
            setIsPlaying(false);
        };

        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.addEventListener('play', handlePlay);
        audioRef.current.addEventListener('pause', handlePause);
        audioRef.current.addEventListener('ended', handleEnded);
        audioRef.current.addEventListener('error', handleError);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current.removeEventListener('play', handlePlay);
                audioRef.current.removeEventListener('pause', handlePause);
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.removeEventListener('error', handleError);
            }
        };
    }, [songs, song]);

    const playSong = async (newSong, songList = []) => {
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
            setSong(newSong);
            
            // Set up new song
            audioRef.current.src = newSong.musicLink;
            audioRef.current.load();

            // Wait for the audio to be loaded
            await new Promise((resolve, reject) => {
                const handleCanPlay = () => {
                    audioRef.current.removeEventListener('canplay', handleCanPlay);
                    audioRef.current.removeEventListener('error', handleError);
                    resolve();
                };

                const handleError = (error) => {
                    audioRef.current.removeEventListener('canplay', handleCanPlay);
                    audioRef.current.removeEventListener('error', handleError);
                    reject(error);
                };

                audioRef.current.addEventListener('canplay', handleCanPlay);
                audioRef.current.addEventListener('error', handleError);
            });

            // Start playing after loading
            await audioRef.current.play();
        } catch (error) {
            console.error("Error playing song:", error);
            console.error("Audio state:", {
                src: audioRef.current.src,
                readyState: audioRef.current.readyState,
                error: audioRef.current.error
            });
            setIsPlaying(false);
        }
    };

    const togglePlay = async () => {
        if (!song || !audioRef.current) return;
        console.log("togglePlay function called");
        try {
            if (isPlaying) {
                console.log("Pausing audio");
                audioRef.current.pause();
            } else {
                console.log("Playing audio");
                audioRef.current.play();
            }
        } catch (error) {
            console.error("Error toggling play:", error);
            setIsPlaying(false);
        }
    };

    const handleNext = () => {
        if (!songs || songs.length === 0) return;
        const currentIndex = songs.findIndex(s => s.musicLink === song?.musicLink);
        const nextIndex = (currentIndex + 1) % songs.length;
        playSong(songs[nextIndex], songs);
    };

    const handlePrevious = () => {
        if (!songs || songs.length === 0) return;
        const currentIndex = songs.findIndex(s => s.musicLink === song?.musicLink);
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        playSong(songs[prevIndex], songs);
    };

    return (
        <MusicPlayerContext.Provider value={{
            song,
            songs,
            isPlaying,
            setIsPlaying,
            playSong,
            togglePlay,
            handleNext,
            handlePrevious,
            audioRef,
            currentTime,
            duration,
            volume,
            setVolume,
        }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayer = () => useContext(MusicPlayerContext);
