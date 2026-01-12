'use client';

import {
  Accordion,
  AccordionItem,
  Button,
  cn,
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
import { getLocalTimeZone, now, parseAbsolute } from '@internationalized/date';
import { useEffect, useState } from 'react';

import type { ShortLink } from '@/features/short-links';

interface EditLinkModalProps {
  openModalEdit: boolean;
  onOpenChange?: () => void;
  action: string | ((formData: FormData) => void | Promise<void>) | undefined;
  isLoading: boolean;
  shortLink: ShortLink | null;
  errors?: Record<string, string[]> | undefined;
}

export const EditLinkModal = ({
  openModalEdit,
  action,
  shortLink,
  isLoading,
  errors,
  onOpenChange,
}: EditLinkModalProps) => {
  const [enableExpiry, setEnableExpiry] = useState(
    Boolean(shortLink?.expiresAt)
  );

  useEffect(() => {
    if (openModalEdit && shortLink) {
      queueMicrotask(() => {
        setEnableExpiry(Boolean(shortLink.expiresAt));
      });
    }
  }, [shortLink, openModalEdit]);

  if (!shortLink) return;

  return (
    <Modal
      key={shortLink.id}
      size="2xl"
      isOpen={openModalEdit}
      onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Edit Short Link</h1>
          <p className="text-xs font-medium text-gray-500">
            Enter the URL you want to shorten. Customize your link with advanced
            options.
          </p>
        </ModalHeader>
        <form action={action} noValidate>
          <ModalBody>
            <input type="hidden" name="id" value={shortLink?.id} />
            <Input
              name="originalUrl"
              isRequired
              defaultValue={shortLink?.originalUrl}
              label="Original URL"
              radius="sm"
              isInvalid={!!errors?.originalUrl}
              errorMessage={errors?.originalUrl?.[0]}
            />
            <Textarea
              name="description"
              label="Description(optional)"
              radius="sm"
              defaultValue={shortLink?.description ?? ''}
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
                    defaultValue={shortLink?.slug}
                    isInvalid={!!errors?.slug}
                    errorMessage={errors?.slug?.[0]}
                  />
                  <div className="flex items-center justify-between">
                    <label htmlFor="expires">Enable expiration</label>
                    <Switch
                      name="expiresAt"
                      isSelected={enableExpiry}
                      onValueChange={setEnableExpiry}
                    />
                  </div>
                  {enableExpiry && (
                    <DatePicker
                      name="expiresAt"
                      label="Expires At"
                      hideTimeZone
                      minValue={now(getLocalTimeZone()).add({ days: 1 })}
                      defaultValue={
                        shortLink?.expiresAt
                          ? parseAbsolute(
                              shortLink?.expiresAt.toString(),
                              getLocalTimeZone()
                            )
                          : now(getLocalTimeZone()).add({ days: 1 })
                      }
                      isInvalid={!!errors?.expiresAt}
                      errorMessage={errors?.expiresAt?.[0]}
                    />
                  )}
                  <Input
                    name="maxClicks"
                    label="Maximum Clicks (optional)"
                    radius="sm"
                    defaultValue={shortLink?.maxClicks?.toString() ?? ''}
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
              Edit Link
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
