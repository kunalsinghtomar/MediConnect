'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

// This component wraps the application with NextAuth SessionProvider
// This makes the user's session available to all components
// Without this, useSession() won't work in client components

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
