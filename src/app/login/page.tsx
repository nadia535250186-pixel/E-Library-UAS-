'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLibrary } from '../components/LibraryProvider';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail } = useLibrary();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const result = loginWithEmail(identifier, password);
    if (!result.ok) {
      setErrorMsg(result.message || 'Login gagal.');
      return;
    }

    router.push('/');
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
      <div style={{ maxWidth: '400px', margin: '40px auto' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          LOGIN
        </h1>

        {errorMsg && (
          <p
            style={{
              marginTop: '16px',
              padding: '10px',
              border: '1px solid #000000',
              backgroundColor: '#f5f5f5',
              color: '#000000',
              fontSize: '13px',
              textAlign: 'center',
            }}
          >
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleLogin} style={{ marginTop: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px',
              }}
            >
              Email atau NIM
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Masukkan email atau NIM"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontFamily: 'Arial, sans-serif',
              }}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontFamily: 'Arial, sans-serif',
              }}
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link
              href="/forgot-password"
              style={{
                fontSize: '13px',
                color: '#000000',
                textDecoration: 'underline',
              }}
            >
              Forgot Password?
            </Link>
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
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: '16px', fontSize: '13px', textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            style={{
              color: '#000000',
              textDecoration: 'underline',
              fontWeight: 'bold',
            }}
          >
            Register
          </Link>
        </p>

        <p
          style={{
            marginTop: '24px',
            fontSize: '12px',
            textAlign: 'center',
            color: '#555555',
          }}
        >
          © 2026 Lafenandher E-Library. Hak Cipta Dilindungi
        </p>
      </div>
    </div>
  );
}