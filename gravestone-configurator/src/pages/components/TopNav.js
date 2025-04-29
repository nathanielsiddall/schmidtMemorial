// src/components/TopNav.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/TopNav.css';

export default function TopNav() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className={`App-nav ${menuOpen ? 'open' : ''}`}>
            <Link to="/" className="logo">
                <img
                    src="/headstone-with-cross-svgrepo-com.svg"
                    alt="Home"
                    className="logo-image"
                />
                <span className="business-name">Monuvita Granite</span>
            </Link>

            {/* hamburger button */}
            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Toggle navigation"
            >
                <span className="hamburger" />
            </button>

            {/* links will show/hide based on .open on the nav */}
            <div className="links">
                <Link to="/design">Configurator</Link>
                <Link to="/other">Other</Link>
                <Link to="/gallery">Gallery</Link>
            </div>
        </nav>
    );
}
