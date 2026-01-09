'use client';

import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { cn } from '@/utils';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            error: cn('bg-red-50! text-red-500! shadow-none! border border-red-100!'),
            success: cn('bg-emerald-50! text-emerald-500! shadow-none! border border-emerald-100!'),
          },
        }}
      />
    </div>
  );
}
