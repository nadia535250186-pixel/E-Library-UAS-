import Link from 'next/link';

export default function KebijakanPage() {
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
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1d1c1c',
            textDecoration: 'underline',
          }}
        >
          ← Kembali ke Beranda
        </Link>

        <h1 style={{ fontSize: '26px', fontWeight: 'bold' }}>
          Syarat &amp; Ketentuan Perpustakaan
        </h1>
        <p style={{ marginTop: '12px', lineHeight: '1.6', color: '#333333' }}>
          Harap membaca dan memahami ketentuan berikut sebelum menggunakan layanan
          Lafenadher E-Library.
        </p>

        <div
          style={{
            marginTop: '24px',
            padding: '20px',
            border: '1px solid #dddddd',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
              1. Ketentuan Keanggotaan
            </h2>
            <p style={{ marginTop: '8px', lineHeight: '1.6', fontSize: '14px', color: '#333333' }}>
              Pengguna wajib mendaftarkan akun menggunakan identitas yang valid untuk
              mengakses fitur peminjaman buku, penyimpanan favorit, riwayat bacaan,
              serta kartu anggota digital Lafenadher E-Library.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
              2. Peminjaman &amp; Pengembalian Buku Digital
            </h2>
            <p style={{ marginTop: '8px', lineHeight: '1.6', fontSize: '14px', color: '#333333' }}>
              Setiap anggota dapat meminjam koleksi buku digital yang tersedia di
              katalog dan wajib mengembalikan buku melalui sistem apabila telah
              selesai dibaca agar riwayat peminjaman tercatat dengan tertib.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
              3. Hak Cipta &amp; Penggunaan Koleksi
            </h2>
            <p style={{ marginTop: '8px', lineHeight: '1.6', fontSize: '14px', color: '#333333' }}>
              Seluruh dokumen PDF dan materi bacaan di dalam Lafenadher E-Library
              hanya diperuntukkan bagi kepentingan pendidikan, penelitian, dan
              bacaan pribadi serta dilarang diperjualbelikan tanpa izin pemilik hak cipta.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
              4. Privasi &amp; Keamanan Data
            </h2>
            <p style={{ marginTop: '8px', lineHeight: '1.6', fontSize: '14px', color: '#333333' }}>
              Data keanggotaan, daftar favorit, dan aktivitas peminjaman dijaga
              kerahasiaannya dan hanya digunakan untuk mendukung operasional
              layanan perpustakaan digital.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}