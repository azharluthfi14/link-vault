'use client';

import { useDisclosure } from '@heroui/react';
import { useState } from 'react';

import { useResettableActionState } from '@/hooks';

import { useShortLinkDetail, useShortLinks } from '../hooks';
import { DetailLink } from './detail-link';
import { TableLink } from './table-link';

export const ShortLinkCLientPage = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [shortLinkId, setShortLinkId] = useState<string | null>(null);

  const { data: shortLink, isLoading: loadingShortLink } = useShortLinks();
  const { data: detailShortLink } = useShortLinkDetail(
    shortLinkId ?? undefined
  );

  const [stateDeleteShortLink, formDeleteShortLink] = useResettableActionState(
    () => '',
    undefined
  );

  const handleClickDetail = (id: string) => {
    setShortLinkId(id);
    onOpen();
  };

  const handleOpenChangeDetail = () => {
    onOpenChange();
    setShortLinkId(null);
  };

  return (
    <div>
      <TableLink
        handleClickDetail={handleClickDetail}
        shortLink={shortLink?.items}
        isLoading={loadingShortLink}
      />
      <DetailLink
        handleEdit={() => ''}
        deleteAction={formDeleteShortLink}
        shortLink={detailShortLink!}
        isOpen={isOpen}
        onOpenChange={handleOpenChangeDetail}
      />
    </div>
  );
};
