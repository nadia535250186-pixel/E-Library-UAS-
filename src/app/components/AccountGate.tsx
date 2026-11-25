'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLibrary } from './LibraryProvider';

export default function AccountGate({
  children,
}: {
  children: React.ReactNode;
}) {
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

  if (!isLoaded || isSwitchingAccount) {
    return null;
  }

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (!currentMember) {
    return null;
  }

  return <>{children}</>;
}