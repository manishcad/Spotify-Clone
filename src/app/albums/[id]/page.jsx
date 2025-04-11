"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import "../../styles/albumsDetails.css";

import { useMusicPlayer } from "../../context/NewContext";
const AlbumDetails = () => {
    const [isPlayerVisible, setIsPlayerVisible] = useState(false);
    const searchParams = useSearchParams();
    const link = searchParams.get('link');
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const {play}=useMusicPlayer()


    const handleClosePlayer = () => {
        setIsPlayerVisible(false);
    };

    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                if (!link) return;
                const response = await axios.get(`/api/albums/singleAlbum?link=${encodeURIComponent(link)}`);
                setAlbum(response.data.data);
            } catch (error) {
                console.error('Error fetching album details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumDetails();
    }, [link]);

    const handleSongClick = (song,index) => {
        console.log("Playing song:");
        play(song, album.songs,album.image,index);
        setIsPlayerVisible(true);
    };

    if (loading) return <p>Loading album details...</p>;

    if (!album) return <p>Album not found.</p>;

    return (
        <div className="album-details">
            <div className="album-container">
                <h2 className="album-title">{album.title}</h2>
                <img src={album.image} alt={album.title} className="album-image" />
                <ul className="song-list">
                    {album.songs.map((song, index) => (
                        <li key={index} className="song-item">
                            <span className="song-name">{song.songName}</span>
                            <div className="action-buttons">
                                <button className="play-btn" onClick={() => handleSongClick(song,index)}>
                                    ▶ Play
                                </button>
                                <a href={song.musicLink} className="download-btn" download>
                                    ⬇ Download
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AlbumDetails;
