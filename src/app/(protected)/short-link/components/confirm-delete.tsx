'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useRef } from 'react';

interface ConfirmDeleteLinkProps {
  openDeleteModal: boolean;
  isPending?: boolean;
  onOpenChange?: () => void;
  formActionDeleteLink: (formData: FormData) => void | Promise<void>;
  selectedLinkId: string | null;
}

export const ConfirmDeleteLink = ({
  openDeleteModal,
  formActionDeleteLink,
  selectedLinkId,
  onOpenChange,
  isPending,
}: ConfirmDeleteLinkProps) => {
  const deleteFormRef = useRef<HTMLFormElement>(null);

  if (!selectedLinkId) return null;

  return (
    <Modal isOpen={openDeleteModal} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <form ref={deleteFormRef} action={formActionDeleteLink}>
              <input type="hidden" name="id" value={selectedLinkId} />
            </form>
            <ModalHeader>Delete Link</ModalHeader>
            <ModalBody>Are you sure? This action cannot be undone.</ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isPending}
                onPress={() => {
                  deleteFormRef.current?.requestSubmit();
                  onClose();
                }}>
                Yes, Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
