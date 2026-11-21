import Link from 'next/link';

export default function ContactPage() {
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
          Hubungi Kami
        </h1>

        <p style={{ marginTop: '12px' }}>
          Jika ada pertanyaan mengenai koleksi buku atau pendaftaran kartu anggota
          LAFENANDHER E-Library, silakan hubungi admin:
        </p>

        <hr style={{ margin: '20px 0', borderColor: '#cccccc' }} />

        <p><b>Admin:</b> LAFENANDHER E-Library</p>
        <p><b>Email:</b> admin@example.com</p>
        <p><b>Alamat:</b> Jl. Literasi Digital No. 14, Jakarta Pusat, Indonesia</p>

        <div style={{ marginTop: '20px' }}>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20LAFENANDHER%20E-Library,%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20kartu%20anggota%20perpustakaan."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '10px 16px',
              textDecoration: 'none',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Chat WhatsApp Admin
          </a>
        </div>
      </div>
    </div>
  );
}