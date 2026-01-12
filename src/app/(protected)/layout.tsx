import type { ReactNode } from 'react';

import { ContentWrapper } from '@/components/layout';
import { Sidebar } from '@/components/ui';
import { getSession } from '@/libs/auth/get-session';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <ContentWrapper user={session.user}>{children}</ContentWrapper>
    </div>
  );
}
