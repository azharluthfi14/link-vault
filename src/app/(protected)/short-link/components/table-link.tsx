'use client';

import {
  Button,
  Card,
  CardBody,
  Chip,
  Link,
  Pagination,
  Snippet,
} from '@heroui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { ExternalLink, Eye, MousePointerClick } from 'lucide-react';

import { DataTable } from '@/components/ui';
import type { ShortLink } from '@/features/short-links';
import { cn, formatExpiresAt } from '@/utils';

interface TableLinkProps {
  handleClickDetail: (id: string) => void;
  shortLink?: ShortLink[];
  isLoading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const TableLink = ({
  handleClickDetail,
  shortLink,
  isLoading,
  onPageChange,
  page,
  totalPages,
}: TableLinkProps) => {
  const columnShortLinkHelper = createColumnHelper<ShortLink>();
  const shortLinkColumn = [
    columnShortLinkHelper.accessor('slug', {
      header: 'Short Link',
      cell: (data) => (
        <Snippet
          symbol=""
          tooltipProps={{
            color: 'primary',
            showArrow: true,
          }}
          classNames={{
            base: cn('p-0 gap-x-0 bg-transparent'),
            copyButton: cn('text-base'),
          }}>
          <Link
            className="cursor-pointer text-xs hover:underline"
            isExternal
            href={`http://localhost:3000/${data.getValue()}`}>
            {`${BASE_URL}/${data.getValue()}`}
          </Link>
        </Snippet>
      ),
    }),
    columnShortLinkHelper.accessor('originalUrl', {
      header: 'Original Link',
      cell: (data) => {
        const link = data.getValue();
        return (
          <Link
            isExternal
            href={link}
            className="hover:text-primary flex cursor-pointer space-x-2 text-xs text-gray-500 transition-colors hover:underline">
            {link.slice(0, 40)}... <ExternalLink className="size-3" />{' '}
          </Link>
        );
      },
    }),
    columnShortLinkHelper.accessor('status', {
      header: 'Status',
      cell: (data) => (
        <Chip
          variant="flat"
          size="sm"
          className="px-2 capitalize"
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
      header: 'Clicks',
      cell: (data) => {
        const countClick = data.getValue();
        return (
          <div className="flex items-center justify-center space-x-2 text-center">
            <MousePointerClick className="size-4" />
            <div>{countClick}</div>
          </div>
        );
      },
    }),
    columnShortLinkHelper.accessor('expiresAt', {
      header: 'Expiration',
      cell: (data) => {
        const value = data.getValue();
        if (!value) return '-';
        return <div>{formatExpiresAt(value.toString())}</div>;
      },
    }),
    columnShortLinkHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Button
              onPress={() => handleClickDetail(row.original.id)}
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
    <div className="space-y-2">
      <Card shadow="none" radius="sm" className="border border-gray-200">
        <CardBody className="p-0">
          <DataTable
            columns={shortLinkColumn}
            data={shortLink ?? []}
            isLoading={isLoading}
          />
        </CardBody>
      </Card>
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            initialPage={page}
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
