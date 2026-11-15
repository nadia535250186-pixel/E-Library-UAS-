"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <Link href="/" className="brand">
        <span className="brand-logo">L</span>
        <span className="brand-name">
          LAFENADHER
          <small>E-Library</small>
        </span>
      </Link>

      <nav className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/katalog">Katalog</Link>
        <Link href="/kategori">Kategori</Link>
        <Link href="/favorit">Favorit</Link>
        <Link href="/riwayat">Riwayat</Link>
      </nav>

      <div className="menu-container">
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Buka menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {menuOpen && (
          <div className="menu-dropdown">
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </div>
        )}
      </div>

      <Link href="/profile" className="profile-icon" aria-label="Profil">
        <Image
          src="/images/profile-icon.jpeg"
          alt="Profil"
          width={39}
          height={39}
          className="profile-image"
        />
      </Link>
    </header>
  );
}