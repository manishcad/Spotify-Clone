'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import '../../styles/card.css';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const Cards = ({ isSearchPage = true }) => {
    const router=useRouter()
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const url = isSearchPage && query
                    ? `/api/albums/search?q=${encodeURIComponent(query)}`
                    : "/api/albums?limit=18";

                const response = await axios.get(url);
                setAlbums(response.data.data);
            } catch (err) {
                console.error("Error fetching albums:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query, isSearchPage]); // Refetch when query changes

    return (
        <div className="album-grid">
            {loading ? (
                <p>Loading Please Wait My Bots Are Scraping Your Data...</p>
            ) : albums.length > 0 ? (
                albums.map((album) => (
                    <div key={album.id} className="album-card" 
                    onClick={() => router.push(`/albums/${album.id}?link=${encodeURIComponent(album.link)}`)}>
                        <Image src={album.image.trim()} alt={album.title} width={100} height={100} className="album-image" />
                        <div className="album-info">{album.title}</div>
                    </div>
                ))
            ) : (
                <p>No albums found.</p>
            )}
        </div>
    );
};

export default Cards;
