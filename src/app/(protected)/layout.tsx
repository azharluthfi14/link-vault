import type { ReactNode } from 'react';

import { ContentWrapper } from '@/components/layout';
import { Sidebar } from '@/components/ui';
import { requireSession } from '@/libs/auth/requires-session';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <ContentWrapper user={session.user}>{children}</ContentWrapper>
    </div>
  );
}
