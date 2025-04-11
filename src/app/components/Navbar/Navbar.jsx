'use client';
import '../../styles/navbar.css';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">Brand</div>
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/features">Features</Link></li>
        <li><Link href="/pricing">Pricing</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
      <div className="auth-buttons">
        <Link href="/login" className="login">Log in</Link>
        <Link href="/signup" className="signup">Sign up</Link>
      </div>
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
      <div className={`mobile-menu z-50 ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/features">Features</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
      
          <li><Link href="/signup" className="signup">Login</Link></li>
          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
