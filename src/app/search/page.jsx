'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cards from '../components/Homepage/Cards';
import '../styles/search.css';

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      axios.get(`/api/albums/search?q=${encodeURIComponent(query)}`)
        .then(response => {
            console.log(response.data,"look here")
          setAlbums(response.data.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching albums:', error);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="search-page">
      <h1 className="search-title text-3xl mt-2 underline">Search Results for  "{query}"</h1>
      {loading ? <p className="loading-text">Loading...</p> : <Cards albums={albums} />}
    </div>
  );
};

export default SearchResults;
