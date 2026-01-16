'use client';

import {
  Accordion,
  AccordionItem,
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Textarea,
} from '@heroui/react';
import { getLocalTimeZone, now } from '@internationalized/date';
import { useState } from 'react';

import { cn } from '@/utils';

interface CreateLinkModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  action: string | ((formData: FormData) => void | Promise<void>) | undefined;
  isLoading: boolean;
  errors?: Record<string, string[]> | undefined;
}

export const CreateLinkModal = ({
  isOpen,
  action,
  isLoading,
  errors,
  onOpenChange,
}: CreateLinkModalProps) => {
  const [enableExpiry, setEnableExpiry] = useState(false);

  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold"> Create Short Link</h1>
          <p className="text-xs font-medium text-gray-500">
            Enter the URL you want to shorten. Customize your link with advanced
            options.
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
            <Textarea
              name="description"
              label="Description(optional)"
              radius="sm"
              isInvalid={!!errors?.description}
              errorMessage={errors?.description}
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
                <div className="space-y-4">
                  <Input
                    name="slug"
                    label="Custom Slug (optional)"
                    radius="sm"
                    isInvalid={!!errors?.slug}
                    errorMessage={errors?.slug?.[0]}
                  />
                  <div className="flex items-center justify-between">
                    <label htmlFor="expires">Enable expiration</label>
                    <Switch
                      name="expires"
                      isSelected={enableExpiry}
                      onValueChange={setEnableExpiry}
                    />
                  </div>
                  {enableExpiry && (
                    <DatePicker
                      name="expiresAt"
                      label="Expires At"
                      hideTimeZone
                      // minValue={now(getLocalTimeZone()).add({ days: 1 })}
                      defaultValue={now(getLocalTimeZone()).add({ days: 1 })}
                      isInvalid={!!errors?.expiresAt}
                      errorMessage={errors?.expiresAt?.[0]}
                    />
                  )}
                  <Input
                    name="maxClicks"
                    label="Maximum Clicks (optional)"
                    radius="sm"
                    isInvalid={!!errors?.maxClicks}
                    errorMessage={errors?.maxClicks?.[0]}
                  />
                </div>
              </AccordionItem>
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onOpenChange}>
              Close
            </Button>
            <Button isLoading={isLoading} type="submit" color="primary">
              Create Link
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
