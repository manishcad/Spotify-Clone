'use client';

import { useState } from 'react';
import '../../styles/homepage.css';
import { useRouter } from 'next/navigation';
const SearchBar = () => {
    const router=useRouter()
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', search);
    if (search.trim()) {
        router.push(`/search?q=${encodeURIComponent(search)}`);
      }
  };

  return (
    <div className="homepage p-5">
      <h1 className="title">"Fuel your soul with sound"</h1>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search here..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
    </div>
  );
};

export default SearchBar;
