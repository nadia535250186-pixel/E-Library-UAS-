'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLibrary } from '../components/LibraryProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { registerMember } = useLibrary();
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Password dan Confirm Password tidak sama!');
      return;
    }

    const result = registerMember({ name, nim, email, password });
    if (!result.ok) {
      setErrorMsg(result.message || 'Pendaftaran gagal.');
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
      <div style={{ maxWidth: '400px', margin: '20px auto' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          REGISTER
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

        <form onSubmit={handleRegister} style={{ marginTop: '24px' }}>
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px',
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
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

          <div style={{ marginBottom: '14px' }}>
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
              placeholder="Enter your NIM"
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

          <div style={{ marginBottom: '14px' }}>
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
              placeholder="Enter your email"
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

          <div style={{ marginBottom: '14px' }}>
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
              placeholder="Create a password"
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
              placeholder="Confirm your password"
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
            Register
          </button>
        </form>

        <p style={{ marginTop: '16px', fontSize: '13px', textAlign: 'center' }}>
          Already have an account?{' '}
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
            color: '#555555',
          }}
        >
          © 2026 Lafenandher E-Library. Hak Cipta Dilindungi
        </p>
      </div>
    </div>
  );
}