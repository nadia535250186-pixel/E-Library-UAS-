"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";

const slides = [
  {
    image: "/images/slide1.jpeg",
    subtitle: "LAFENADHER E-LIBRARY",
    title: "Temukan buku yang ingin kamu baca.",
    description:
      "Jelajahi koleksi buku digital berdasarkan judul, penulis, atau kategori.",
  },
  {
    image: "/images/slide2.jpeg",
    subtitle: "JELAJAHI DUNIA PENGETAHUAN",
    title: "Temukan inspirasi dari setiap halaman.",
    description:
      "Nikmati pengalaman membaca dan perluas wawasan melalui koleksi perpustakaan digital.",
  },
  {
    image: "/images/slide3.jpeg",
    subtitle: "RUANG BACA DIGITAL",
    title: "Mulai perjalanan membaca kamu.",
    description:
      "Temukan berbagai pilihan buku menarik yang bisa menemani waktu luangmu.",
  },
];

const shelves = [
  {
    number: "01 / RAK TERBARU",
    title: "Temukan yang baru.",
    description: "Jelajahi buku berdasarkan tahun terbit.",
    image: "/images/slide1.jpeg",
    link: "/katalog",
  },
  {
    number: "02 / PILIHAN PEMBACA",
    title: "Baca yang disukai.",
    description: "Mulai dari judul pilihan pembaca.",
    image: "/images/slide2.jpeg",
    link: "/favorit",
  },
  {
    number: "03 / PILIHAN EDITOR",
    title: "Jelajahi cerita lain.",
    description: "Temukan bacaan lintas genre.",
    image: "/images/slide3.jpeg",
    link: "/kategori",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const startX = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function showSlide(index: number) {
    if (index >= slides.length) {
      setActiveSlide(0);
    } else if (index < 0) {
      setActiveSlide(slides.length - 1);
    } else {
      setActiveSlide(index);
    }
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    startX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const endX = event.changedTouches[0].clientX;
    const difference = startX.current - endX;

    if (difference > 50) {
      showSlide(activeSlide + 1);
    } else if (difference < -50) {
      showSlide(activeSlide - 1);
    }
  }

  return (
    <>
      <Navbar />

      <main>
        <section className="hero-carousel">
          <div
            className="hero-track"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, index) => (
              <div
                className="hero-slide"
                key={index}
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(45, 24, 12, 0.72), rgba(75, 38, 15, 0.18)), url("${slide.image}")`,
                }}
              >
                <div className="hero-content">
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <h1>{slide.title}</h1>
                  <p className="hero-description">{slide.description}</p>
                  <Link href="/katalog" className="hero-button">
                    Jelajahi Katalog
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <button
            className="slider-button slider-prev"
            type="button"
            onClick={() => showSlide(activeSlide - 1)}
            aria-label="Gambar sebelumnya"
          >
            ‹
          </button>

          <button
            className="slider-button slider-next"
            type="button"
            onClick={() => showSlide(activeSlide + 1)}
            aria-label="Gambar berikutnya"
          >
            ›
          </button>

          <div className="carousel-dots">
            {slides.map((slide, index) => (
              <button
                key={index}
                type="button"
                className={`carousel-dot ${
                  activeSlide === index ? "active" : ""
                }`}
                onClick={() => showSlide(index)}
                aria-label={`Gambar ${index + 1}`}
                aria-current={activeSlide === index}
              />
            ))}
          </div>
        </section>

        <section className="recommendation-section">
          <div className="section-heading">
            <div>
              <h2>
                Temukan rak yang
                <br />
                cocok untukmu.
              </h2>
              <p>
                Dari koleksi terbaru sampai pilihan pembaca, semuanya
                terhubung ke detail buku dan PDF.
              </p>
            </div>

            <Link href="/katalog" className="catalog-link">
              Buka katalog lengkap ↗
            </Link>
          </div>

          <div className="shelf-grid">
            {shelves.map((shelf) => (
              <Link
                href={shelf.link}
                className="shelf-card"
                key={shelf.number}
                style={{
                  backgroundImage: `linear-gradient(0deg, rgba(20, 14, 11, 0.88), rgba(20, 14, 11, 0.05) 85%), url("${shelf.image}")`,
                }}
              >
                <div className="shelf-card-content">
                  <p className="shelf-number">{shelf.number}</p>
                  <div className="shelf-card-bottom">
                    <div>
                      <h3>{shelf.title}</h3>
                      <p>{shelf.description}</p>
                    </div>
                    <span className="shelf-arrow">↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="pdf-banner">
          <div>
            <p className="section-subtitle">SUDAH TAHU YANG INGIN DIBACA?</p>
            <h2>Masuk ke ruang baca PDF</h2>
          </div>

          <Link href="/katalog" className="pdf-arrow" aria-label="Buka katalog">
            →
          </Link>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <h3>LAFENADHER E-Library</h3>
          <p>
            Perpustakaan digital untuk membaca dan menemukan buku.
          </p>
        </div>

        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <p className="footer-copyright">
          © 2026 LAFENADHER E-Library. All rights reserved.
        </p>
      </footer>
    </>
  );
}