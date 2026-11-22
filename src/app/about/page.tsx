import Link from 'next/link';

export default function AboutPage() {
  return (
    <div
      className="plain-page"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: 'Arial, sans-serif',
        overflowY: 'auto',
        padding: '32px',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Link href="/" style={{ textDecoration: 'underline', color: '#000000' }}>
          &larr; Kembali ke Beranda
        </Link>

        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px', fontFamily: 'Arial, sans-serif' }}>
          Tentang LAFENANDHER E-Library
        </h1>

        <p style={{ marginTop: '12px', lineHeight: '1.6' }}>
          LAFENANDHER E-Library adalah website perpustakaan digital sederhana
          yang dibuat untuk memudahkan mahasiswa mencari dan membaca koleksi buku
          secara online.
        </p>

        <hr style={{ margin: '20px 0', borderColor: '#cccccc' }} />

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
          Tujuan Website
        </h2>
        <p style={{ marginTop: '8px', lineHeight: '1.6' }}>
          Membantu mahasiswa mendapatkan akses bahan bacaan dengan mudah dan
          praktis kapan saja.
        </p>

        <hr style={{ margin: '20px 0', borderColor: '#cccccc' }} />

        <p><b>Didirikan:</b> 14 September 2026</p>
        <p style={{ marginTop: '8px' }}>
          Untuk membuat kartu anggota, silakan buka halaman{' '}
          <Link href="/contact" style={{ textDecoration: 'underline', color: '#000000' }}>
            Contact
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
