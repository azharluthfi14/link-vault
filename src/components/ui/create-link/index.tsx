'use client';

import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';

import { cn } from '@/utils';

interface CreateLinkModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  action: string | ((formData: FormData) => void | Promise<void>) | undefined;
  isLoading: boolean;
  errors?: Record<string, string[]> | null;
}

export const CreateLinkModal = ({
  isOpen,
  action,
  isLoading,
  errors,
  onOpenChange,
}: CreateLinkModalProps) => {
  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold"> Create Short Link</h1>
              <p className="text-xs text-gray-500">
                Enter the URL you want to shorten. Customize your link with
                advanced options.
              </p>
            </ModalHeader>
            <form action={action} noValidate>
              <ModalBody>
                <Input
                  name="originalUrl"
                  isRequired
                  label="Original URL"
                  radius="sm"
                  isInvalid={!!errors?.originalUrl}
                  errorMessage={errors?.originalUrl?.[0]}
                />
                <Accordion className="px-0!">
                  <AccordionItem
                    classNames={{
                      indicator: cn('rotate-180'),
                      title: cn('text-sm font-medium'),
                    }}
                    key="1"
                    aria-label="advandced options"
                    title="Advanced Options">
                    <div>
                      <Input
                        name="slug"
                        label="Custom Slug (optional)"
                        radius="sm"
                        isInvalid={!!errors?.slug}
                        errorMessage={errors?.slug?.[0]}
                      />
                    </div>
                  </AccordionItem>
                </Accordion>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={isLoading}
                  type="submit"
                  color="primary"
                  onPress={onClose}>
                  Create Link
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
