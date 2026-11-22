import type { Metadata } from 'next';
import './globals.css';
import { LibraryProvider } from './components/LibraryProvider';
import AccountGate from './components/AccountGate';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: 'Lafenandher E-Library',
  description: 'Perpustakaan Digital Lafenandher',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased app-shell">
        <LibraryProvider>
          <AccountGate>
            <div className="app-layout flex min-h-screen">
              <Navbar />
              <main className="content-shell flex-1 min-w-0 p-6 md:p-8 flex flex-col justify-between">
                <div className="app-content">{children}</div>
                <footer className="app-footer mt-12 pt-6 border-t border-slate-200/70 text-center text-[11px]">
                  © 2026 Lafenandher E-Library. Hak Cipta Dilindungi.
                </footer>
              </main>
            </div>
          </AccountGate>
        </LibraryProvider>
      </body>
    </html>
  );
}
