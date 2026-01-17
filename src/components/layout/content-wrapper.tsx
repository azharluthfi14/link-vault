'use client';

import { cn, useDisclosure } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from 'better-auth';
import type { ReactNode } from 'react';
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
  const queryClient = useQueryClient();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [
    stateCreateLink,
    formCreateLink,
    pendingCreateLink,
    resetStateCreateLink,
  ] = useResettableActionState(createShortLinkAction, null, {
    onSuccess: (result) => {
      if (result?.success) {
        toast.success('Shortlink created');
        onClose();
        resetStateCreateLink();
        queryClient.invalidateQueries({ queryKey: ['short-links'] });
      }
    },
    onError: (result) => {
      if (!result?.success && result?.code !== 'VALIDATION_ERROR') {
        toast.error(result?.error);
        onClose();
      }
    },
  });

  const handleClickAddLink = () => {
    onOpen();
  };

  const handleOpenChange = () => {
    onOpenChange();
    resetStateCreateLink();
  };

  return (
    <>
      <main
        className={cn(
          'min-h-screen bg-slate-50 pt-16 transition-all duration-300 md:pt-0',
          'md:ml-64'
        )}>
        <Navbar user={user} handleClickAddLink={handleClickAddLink} />
        <div className="space-y-6 overflow-y-auto bg-inherit p-4 md:p-6">
          {children}
        </div>
      </main>
      <CreateLinkModal
        action={formCreateLink}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        isLoading={pendingCreateLink}
        errors={
          !stateCreateLink?.success &&
          stateCreateLink?.code === 'VALIDATION_ERROR' &&
          !stateCreateLink?.showToast
            ? stateCreateLink.fieldErrors
            : undefined
        }
      />
    </>
  );
};
