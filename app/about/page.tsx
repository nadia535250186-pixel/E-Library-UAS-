import Link from "next/link";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="about-hero">
          <h2>Tentang E-Library</h2>
          <p>
            E-Library adalah perpustakaan digital yang membantu pengguna
            menemukan dan melihat informasi koleksi buku secara online.
          </p>
        </section>

        <section className="about-content">
          <h2>Tujuan dan Manfaat</h2>

          <div className="about-list">
            <div className="about-card">
              <h3>Memudahkan Akses</h3>
              <p>
                Membantu pengguna menemukan informasi buku dengan
                lebih mudah melalui perpustakaan digital.
              </p>
            </div>

            <div className="about-card">
              <h3>Mencari Koleksi Buku</h3>
              <p>
                Pengguna dapat mencari berbagai koleksi buku
                berdasarkan informasi yang tersedia.
              </p>
            </div>

            <div className="about-card">
              <h3>Informasi Terorganisir</h3>
              <p>
                Informasi koleksi buku disajikan secara terstruktur
                agar lebih mudah dipahami.
              </p>
            </div>
          </div>
        </section>

        <section className="vision-mission">
          <div>
            <h2>Visi</h2>
            <p>
              Menjadi perpustakaan digital yang mudah digunakan
              untuk membantu pengguna menemukan informasi dan koleksi buku.
            </p>
          </div>

          <div>
            <h2>Misi</h2>
            <p>
              Menyediakan informasi koleksi buku secara digital
              dengan tampilan yang sederhana, terorganisir, dan mudah diakses.
            </p>
          </div>
        </section>

        <section className="team-info">
          <h2>Tentang Website</h2>
          <p>
            E-Library dikembangkan sebagai website perpustakaan digital
            yang menyediakan berbagai fitur untuk membantu pengguna
            mencari dan mendapatkan informasi mengenai koleksi buku.
          </p>
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