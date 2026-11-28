'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLibrary } from '../components/LibraryProvider';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useLibrary();

  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Password dan Confirm Password tidak sama!');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal harus 6 karakter.');
      return;
    }

    const result = resetPassword(nim, email, password);

    if (!result.ok) {
      setErrorMsg(result.message || 'Reset password gagal.');
      return;
    }

    setSuccessMsg('Password berhasil diperbarui!');

    setTimeout(() => {
      router.push('/login');
    }, 1500);
  };

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
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: '400px', margin: '20px auto' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          FORGOT PASSWORD
        </h1>

        <p
          style={{
            marginTop: '12px',
            fontSize: '13px',
            textAlign: 'center',
            color: '#555555',
          }}
        >
          Masukkan NIM dan Email terdaftar untuk mengatur ulang password.
        </p>

        {errorMsg && (
          <p
            style={{
              marginTop: '16px',
              padding: '10px',
              border: '1px solid #000000',
              backgroundColor: '#f5f5f5',
              fontSize: '13px',
              textAlign: 'center',
            }}
          >
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p
            style={{
              marginTop: '16px',
              padding: '10px',
              border: '1px solid #000000',
              backgroundColor: '#f5f5f5',
              fontSize: '13px',
              textAlign: 'center',
            }}
          >
            {successMsg}
          </p>
        )}

        <form onSubmit={handleResetPassword} style={{ marginTop: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px',
              }}
            >
              NIM
            </label>
            <input
              type="text"
              required
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="Masukkan NIM"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email terdaftar"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px',
              }}
            >
              Password Baru
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password baru"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px',
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password baru"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Reset Password
          </button>
        </form>

        <p
          style={{
            marginTop: '16px',
            fontSize: '13px',
            textAlign: 'center',
          }}
        >
          Remember your password?{' '}
          <Link
            href="/login"
            style={{
              color: '#000000',
              textDecoration: 'underline',
              fontWeight: 'bold',
            }}
          >
            Login
          </Link>
        </p>

        <p
          style={{
            marginTop: '24px',
            fontSize: '12px',
            textAlign: 'center',
            color: '#000000',
          }}
        >
          © 2026 Lafenandher E-Library. Hak Cipta Dilindungi
        </p>
      </div>
    </div>
  );
}