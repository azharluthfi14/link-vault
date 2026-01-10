'use client';

import { cn, useDisclosure } from '@heroui/react';
import type { User } from 'better-auth';
import { type ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

import { createShortLinkAction } from '@/features/short-links/actions/short-link.action';
import { useResettableActionState } from '@/hooks';

import { Navbar } from '../ui';
import { CreateLinkModal } from '../ui/create-link';

export const ContentWrapper = ({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [stateCreateLink, formCreateLink, pendingCreateLink] =
    useResettableActionState(createShortLinkAction, undefined);

  const handleClickAddLink = () => {
    onOpen();
  };

  useEffect(() => {
    if (stateCreateLink?.success) {
      toast.success('Success create short link');
      queueMicrotask(() => {
        onClose();
      });
    }
  }, [stateCreateLink?.success]);

  return (
    <>
      <main
        className={cn(
          'min-h-screen bg-slate-50 pt-16 transition-all duration-300 md:pt-0',
          'md:ml-64'
        )}>
        <Navbar user={user} handleClickAddLink={handleClickAddLink} />
        <div className="space-y-6 overflow-y-auto p-4 md:p-6">{children}</div>
      </main>
      <CreateLinkModal
        action={formCreateLink}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isLoading={pendingCreateLink}
      />
    </>
  );
};
