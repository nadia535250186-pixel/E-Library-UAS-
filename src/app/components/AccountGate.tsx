'use client';

import { useState } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useLibrary } from './LibraryProvider';

export default function AccountGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    members,
    currentMember,
    isSwitchingAccount,
    switchMember,
    registerMember,
    loginWithEmail,
  } = useLibrary();

  // Mode tampilan sebelum masuk ke E-Library: 'login' | 'register' | 'quick-select'
  const [authMode, setAuthMode] = useState<
    'login' | 'register' | 'quick-select'
  >('login');

  // State Form Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State Form Register (dengan NIM)
  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (isSwitchingAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-600">
            Memuat akun E-Library...
          </p>
        </div>
      </div>
    );
  }

  // Jika sudah login, tampilkan halaman utama E-Library
  if (currentMember) {
    return <>{children}</>;
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Email/NIM dan Password wajib diisi.');
      return;
    }

    const res = loginWithEmail(loginEmail, loginPassword);
    if (!res.ok && res.message) {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !fullName.trim() ||
      !nim.trim() ||
      !regEmail.trim() ||
      !regPassword.trim()
    ) {
      setErrorMsg('Semua kolom (termasuk NIM) wajib diisi.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setErrorMsg('Confirm Password tidak cocok dengan Password.');
      return;
    }

    const res = registerMember({
      name: fullName,
      nim,
      email: regEmail,
      password: regPassword,
    });

    if (!res.ok && res.message) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200/80 p-7 space-y-6">
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm mb-3">
            <BookOpen className="w-5 h-5" />
          </div>

          {authMode === 'login' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome Back!
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Login to your Lafenandher E-Library account
              </p>
            </>
          )}

          {authMode === 'register' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900">
                Create Account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Register to join Lafenandher E-Library
              </p>
            </>
          )}

          {authMode === 'quick-select' && (
            <>
              <h1 className="text-xl font-bold text-slate-900">
                Lafenandher E-Library
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Pilih akun anggota untuk masuk ke perpustakaan digital
              </p>
            </>
          )}
        </div>

        {/* Pesan Error */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-2.5 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* 1. FORM LOGIN (Welcome Back!) */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email atau NIM
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email or NIM"
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Login
            </button>

            <div className="text-center space-y-2 pt-1">
              <p className="text-xs text-slate-500">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setAuthMode('register');
                  }}
                  className="font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Register
                </button>
              </p>

              <p className="text-[11px] text-slate-400">
                atau{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setAuthMode('quick-select');
                  }}
                  className="text-slate-600 font-medium hover:text-blue-600 underline cursor-pointer"
                >
                  Pilih Akun Anggota Terdaftar
                </button>
              </p>
            </div>
          </form>
        )}

        {/* 2. FORM REGISTER (Create Account + NIM) */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                NIM
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Enter your NIM (contoh: 535250186)"
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Register
            </button>

            <p className="text-center text-xs text-slate-500 pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthMode('login');
                }}
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Login
              </button>
            </p>
          </form>
        )}

        {/* 3. PILIH AKUN ANGGOTA (Tampilan Foto 1) */}
        {authMode === 'quick-select' && (
          <div className="space-y-3">
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {members.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => switchMember(member.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        NIM {member.nim} • {member.role}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setAuthMode('login');
              }}
              className="w-full text-center text-xs font-medium text-blue-600 hover:underline pt-1 cursor-pointer"
            >
              ← Kembali ke Halaman Login / Register
            </button>
          </div>
        )}

        <p className="text-center text-[10px] text-slate-400 pt-1">
          © 2026 Lafenandher E-Library. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
}