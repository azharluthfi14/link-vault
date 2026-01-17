'use client';

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Link,
} from '@heroui/react';
import {
  AlertCircle,
  BarChart3,
  Clock,
  ExternalLink,
  Link2,
  MousePointer2,
} from 'lucide-react';
import { useRef } from 'react';

import type { ShortLink } from '@/features/short-links';
import { formatExpiresAt } from '@/utils';

interface DetailLinkProps {
  deleteAction: (formData: FormData) => void | Promise<void>;
  enableAction: (formData: FormData) => void | Promise<void>;
  disableAction: (formData: FormData) => void | Promise<void>;
  shortLink: ShortLink;
  isOpen: boolean;
  onOpenChange?: () => void;
  openEditModal: () => void;
  openDeleteModal: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const DetailLink = ({
  deleteAction,
  openEditModal,
  onOpenChange,
  openDeleteModal,
  enableAction,
  disableAction,
  shortLink,
  isOpen,
}: DetailLinkProps) => {
  const deleteFormRef = useRef<HTMLFormElement>(null);

  if (!shortLink) return;

  return (
    <>
      <form ref={deleteFormRef} action={deleteAction}>
        <input type="hidden" name="driverId" value={shortLink?.id} />
      </form>
      <Drawer radius="sm" size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex justify-between border-b border-gray-200">
                <div className="space-y-1">
                  <h1 className="text-base font-semibold">Detail Link</h1>
                  <p className="font-mono text-xs font-normal text-gray-400">
                    ID: {shortLink.id}
                  </p>
                </div>
              </DrawerHeader>
              <DrawerBody>
                <div className="space-y-4 py-4">
                  <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Short Link
                        </label>
                        <div className="text-primary flex items-center gap-2 text-xl font-bold">
                          <Link2 size={20} className="shrink-0" />
                          <span>
                            {BASE_URL}/{shortLink.slug}
                          </span>
                        </div>
                      </div>
                      {/* <CopyButton
                        text={`s.id/${data.slug}`}
                        size={18}
                        className="border border-gray-200 bg-white"
                      /> */}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex flex-col rounded-lg border border-gray-100 bg-white p-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <BarChart3 size={12} /> Total Click
                        </span>
                        <span className="mt-1 text-2xl font-bold text-gray-900">
                          {shortLink.clicks.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col rounded-lg border border-gray-100 bg-white p-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MousePointer2 size={12} /> Remaining Quota
                        </span>
                        <span className="mt-auto text-lg font-semibold text-gray-900">
                          {shortLink.maxClicks
                            ? (
                                shortLink.maxClicks - shortLink.clicks
                              ).toLocaleString()
                            : '∞'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      Destination URL
                    </label>
                    <div className="group relative">
                      <div className="rounded-lg border border-gray-200 bg-white p-3 pr-10 text-sm break-all text-gray-600">
                        {shortLink.originalUrl}
                      </div>
                      <Link
                        href={shortLink.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute top-2 right-2 rounded-md bg-white p-1.5 text-gray-400 transition hover:text-blue-600">
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <p
                      className={`text-sm ${shortLink.description ? 'rounded-lg bg-gray-50 p-3 text-gray-600' : 'text-gray-400 italic'}`}>
                      {shortLink.description || 'No description.'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="border-b border-gray-100 pb-2 text-sm font-medium text-gray-900">
                      Limit configuration
                    </h3>
                    <div className="grid grid-cols-1 gap-4 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Expires At
                          </p>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {shortLink.expiresAt
                              ? formatExpiresAt(shortLink.expiresAt.toString())
                              : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                          <AlertCircle size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Maximum click
                          </p>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {shortLink.maxClicks
                              ? `${shortLink.maxClicks.toLocaleString()} click`
                              : 'Unlimited'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter className="flex justify-between">
                <Button
                  fullWidth
                  color="primary"
                  radius="sm"
                  onPress={() => {
                    onClose?.();
                    openEditModal();
                  }}>
                  Edit Short Link
                </Button>
                {shortLink.status === 'active' ? (
                  <form action={disableAction}>
                    <input type="hidden" name="id" value={shortLink.id} />
                    <Button
                      fullWidth
                      radius="sm"
                      color="warning"
                      variant="flat"
                      type="submit">
                      Disable Link
                    </Button>
                  </form>
                ) : (
                  <form action={enableAction}>
                    <input type="hidden" name="id" value={shortLink.id} />
                    <Button
                      fullWidth
                      radius="sm"
                      color="success"
                      variant="flat"
                      type="submit">
                      Enable Link
                    </Button>
                  </form>
                )}
                <Button
                  onPress={() => {
                    onClose?.();
                    openDeleteModal();
                  }}
                  fullWidth
                  radius="sm"
                  color="danger"
                  variant="flat">
                  Delete
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
