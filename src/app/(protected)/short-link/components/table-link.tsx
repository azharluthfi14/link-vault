'use client';

import { Button, Card, CardBody, Chip, Link } from '@heroui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { DataTable } from '@/components/ui';
import type { ShortLink } from '@/features/short-links';

import { useShortLinks } from '../hooks/use-short-link';

interface TableLinkProps {
  userId: string;
}

export const TableLink = ({ userId }: TableLinkProps) => {
  const { data } = useShortLinks();
  const columnShortLinkHelper = createColumnHelper<ShortLink>();
  const shortLinkColumn = [
    columnShortLinkHelper.accessor('slug', {
      header: 'Slug Url',
      cell: (data) => (
        <Link
          className="text-xs"
          isExternal
          href={`http://localhost:3000/${data.getValue()}`}>
          {data.getValue()}
        </Link>
      ),
    }),
    columnShortLinkHelper.accessor('originalUrl', {
      header: 'Original Url',
      cell: (data) => data.getValue(),
    }),
    columnShortLinkHelper.accessor('status', {
      header: 'Status',
      cell: (data) => (
        <Chip
          variant="flat"
          className="px-3 capitalize"
          color={
            data.getValue() === 'active'
              ? 'success'
              : data.getValue() === 'disabled'
                ? 'warning'
                : 'danger'
          }>
          {data.getValue()}
        </Chip>
      ),
    }),
    columnShortLinkHelper.accessor('clicks', {
      header: 'Click',
      cell: (data) => data.getValue(),
    }),
    columnShortLinkHelper.accessor('expiresAt', {
      header: 'Expires',
      cell: (data) => data.getValue(),
    }),
    columnShortLinkHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Button
              onPress={() => ''}
              isIconOnly
              size="sm"
              color="default"
              className="border border-gray-200 font-medium"
              variant="solid">
              <Eye className="size-4" />
            </Button>
          </div>
        );
      },
    }),
  ];

  return (
    <Card shadow="none" className="border border-gray-200">
      <CardBody className="p-0">
        <DataTable columns={shortLinkColumn} data={data?.items ?? []} />
      </CardBody>
    </Card>
  );
};
