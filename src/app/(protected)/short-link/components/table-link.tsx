'use client';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Link,
  Pagination,
  Select,
  SelectItem,
  Snippet,
} from '@heroui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { ExternalLink, Eye, MousePointerClick, Search } from 'lucide-react';

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
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

const categoryStatus = [
  { key: 'active', label: 'Active' },
  { key: 'disabled', label: 'Disabled' },
  { key: 'status', label: 'Status' },
];

export const TableLink = ({
  handleClickDetail,
  shortLink,
  isLoading,
  onPageChange,
  page,
  totalPages,
  keyword,
  setKeyword,
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
            href={`${BASE_URL}/${data.getValue()}`}>
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
        <CardHeader>
          <div className="flex w-full items-end justify-end gap-x-4">
            <Input
              type="text"
              radius="sm"
              isClearable
              onClear={() => setKeyword('')}
              placeholder="Find your slug..."
              startContent={<Search className="size-4 text-gray-400" />}
              className="w-4/12"
              value={keyword}
              onValueChange={setKeyword}
              classNames={{
                clearButton: cn('text-gray-500'),
              }}
            />
            <Select radius="sm" placeholder="Select status" className="w-2/12">
              {categoryStatus.map((status) => (
                <SelectItem key={status.key}>{status.label}</SelectItem>
              ))}
            </Select>
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
