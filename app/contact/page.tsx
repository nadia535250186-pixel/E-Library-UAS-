"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("Pesan berhasil dikirim! Terima kasih sudah menghubungi kami.");

    e.currentTarget.reset();
  }

  return (
    <>
      <Navbar />

      <main>
        <section className="contact-hero">
          <h2>Hubungi Kami</h2>
          <p>
            Jika kamu memiliki pertanyaan atau ingin menyampaikan pesan,
            silakan hubungi E-Library melalui informasi berikut.
          </p>
        </section>

        <section className="contact-section">
          <div className="contact-info">
            <h2>Informasi Kontak</h2>

            <div className="contact-item">
              <h3>Alamat</h3>
              <p>Jakarta, Indonesia</p>
            </div>

            <div className="contact-item">
              <h3>Email</h3>
              <p>elibrary@example.com</p>
            </div>

            <div className="contact-item">
              <h3>Telepon</h3>
              <p>021-12345678</p>
            </div>

            <div className="contact-item">
              <h3>Jam Operasional</h3>
              <p>Senin - Jumat, 08.00 - 16.00</p>
            </div>
          </div>

          <div className="contact-form">
            <h2>Kirim Pesan</h2>

            <form onSubmit={handleSubmit}>
              <label htmlFor="nama">Nama</label>
              <input
                type="text"
                id="nama"
                placeholder="Masukkan nama"
                required
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Masukkan email"
                required
              />

              <label htmlFor="pesan">Pesan</label>
              <textarea
                id="pesan"
                rows={6}
                placeholder="Tulis pesan kamu"
                required
              />

              <button type="submit">Kirim Pesan</button>

              {status && (
                <p className="contact-success" role="status">
                  {status}
                </p>
              )}
            </form>
          </div>
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