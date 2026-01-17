'use client';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Pagination,
  Snippet,
  Tab,
  Tabs,
} from '@heroui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { ExternalLink, Eye, MousePointerClick, Search } from 'lucide-react';
import Link from 'next/link';
import type { Key } from 'react';

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
  keyword: string;
  setKeyword: (keyword: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

const categoryStatus = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'disabled', label: 'Disabled' },
  { key: 'expired', label: 'Expired' },
];

export const TableLink = ({
  handleClickDetail,
  shortLink,
  isLoading,
  onPageChange,
  page,
  totalPages,
  keyword,
  status,
  setKeyword,
  onStatusChange,
}: TableLinkProps) => {
  const columnShortLinkHelper = createColumnHelper<ShortLink>();
  const shortLinkColumn = [
    columnShortLinkHelper.accessor('slug', {
      header: 'Short Link',
      cell: (data) => {
        const isDisabled = data.row?.original?.status !== 'active';
        return isDisabled ? (
          <div className="cursor-default text-xs font-medium text-gray-400 line-through">{`${BASE_URL}/${data.getValue()}`}</div>
        ) : (
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
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary cursor-pointer font-sans text-xs font-medium hover:underline"
              href={`/${data.getValue()}`}>
              {`${BASE_URL}/${data.getValue()}`}
            </Link>
          </Snippet>
        );
      },
    }),
    columnShortLinkHelper.accessor('originalUrl', {
      header: 'Original Link',
      cell: (data) => {
        const link = data.getValue();
        return (
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
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
      header: 'Views',
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
        <CardHeader>
          <div className="flex w-full items-center justify-between gap-x-4">
            <Input
              type="text"
              radius="sm"
              isClearable
              onClear={() => setKeyword('')}
              placeholder="Find your slug..."
              startContent={<Search className="size-4 text-gray-400" />}
              className="w-6/12"
              value={keyword}
              onValueChange={setKeyword}
              classNames={{
                clearButton: cn('text-gray-500'),
              }}
            />
            <Tabs
              aria-label="Options"
              radius="sm"
              color="primary"
              selectedKey={status}
              variant="light"
              onSelectionChange={(key: Key) => onStatusChange(key.toString())}
              classNames={{
                base: cn('w-5/12'),
                tabList: cn('w-full'),
              }}>
              {categoryStatus.map((item) => (
                <Tab key={item.key} title={item.label} />
              ))}
            </Tabs>
          </div>
        </CardHeader>
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
            showControls
          />
        </div>
      )}
    </div>
  );
};
