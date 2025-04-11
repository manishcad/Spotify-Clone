"use client";
import "../../styles/musicPlayer.css";
import React, { useState, useEffect } from "react";
import { useMusicPlayer } from "../../context/MusicPlayerContext";
import Image from "next/image";

const MusicPlayer = ({ albumImage, onClose }) => {
    const { 
        song, 
        songs, 
        isPlaying, 
        togglePlay, 
        handleNext, 
        handlePrevious, 
        audioRef,
        currentTime,
        duration,
        volume,
        setVolume
    } = useMusicPlayer();
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!song || !audioRef.current) return;
    
        console.log("New song selected:", song.musicLink);
        if (audioRef.current) {
            audioRef.current.src = song.musicLink;
            audioRef.current.load();
            setIsLoading(true);
        }
    
        const handleCanPlay = () => setIsLoading(false);
        
        audioRef.current?.addEventListener("canplay", handleCanPlay);
        return () => {
            audioRef.current?.removeEventListener("canplay", handleCanPlay);
        };
    }, [song]);
    

    const handleSeek = (e) => {
        if (audioRef.current) {
            const newTime = parseFloat(e.target.value);
            audioRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            setVolume(newVolume);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = async () => {
        console.log("handlePlayPause function called");
        try {
            await togglePlay();
        } catch (error) {
            console.error("Error toggling play/pause:", error);
        }
    };

    if (!song) return null;

    return (
        <div className={`music-player ${isMinimized ? "minimized" : ""}`}>
            <audio ref={audioRef} />

            <div className="player-header">
                <button 
                    className="minimize-btn" 
                    onClick={() => setIsMinimized(!isMinimized)}
                >
                    {isMinimized ? "🔼" : "🔽"}
                </button>
                <button className="close-btn" onClick={onClose}>❌</button>
            </div>

            <Image 
                src={albumImage || "/default-cover.jpg"} 
                alt={song.songName} 
                className="album-cover" 
                width={100}
                height={100}
            />

            {!isMinimized && (
                <div className="player-content">
                    <h4>{song.songName}</h4>
                    <div className="time-controls">
                        <span>{formatTime(currentTime)}</span>
                        <input 
                            type="range" 
                            value={currentTime} 
                            max={duration || 1} 
                            onChange={handleSeek} 
                            className="seek-bar" 
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div className="controls">
                        <button 
                            className="control-btn" 
                            onClick={handlePrevious} 
                            disabled={!songs || songs.length === 0}
                        >
                            ⏮
                        </button>
                        
                        {isLoading ? (
                            <div className="spinner"></div>
                        ) : (
                            <button 
                                className="control-btn" 
                                onClick={handlePlayPause} 
                                disabled={!song}
                            >
                                {isPlaying ? "⏸" : "▶"}
                            </button>
                        )}

                        <button 
                            className="control-btn" 
                            onClick={handleNext} 
                            disabled={!songs || songs.length === 0}
                        >
                            ⏭
                        </button>
                    </div>
                    <div className="volume-control">
                        <span>🔊</span>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={volume} 
                            onChange={handleVolumeChange} 
                            className="volume-slider" 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;
