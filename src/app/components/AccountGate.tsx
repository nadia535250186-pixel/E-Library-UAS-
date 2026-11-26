'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLibrary } from './LibraryProvider';

function AuthRedirector() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentMember, isLoaded, isSwitchingAccount } = useLibrary();

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password';

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSwitchingAccount && !currentMember && !isAuthRoute) {
      router.replace('/login');
    }
  }, [isLoaded, isSwitchingAccount, currentMember, isAuthRoute, router]);

  return null;
}

export default function AccountGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSwitchingAccount } = useLibrary();

  if (!isLoaded || isSwitchingAccount) {
    return null;
  }

  return (
    <>
      <Suspense fallback={null}>
        <AuthRedirector />
      </Suspense>
      {children}
    </>
  );
}