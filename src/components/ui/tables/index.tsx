/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { cn } from '@heroui/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FileText } from 'lucide-react';
import { useMemo } from 'react';

type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  className?: string;
};

export function DataTable<T>({ data, columns, className }: TableProps<T>) {
  const memoizedColumn = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumn,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={`scrollbar-hide overflow-x-auto ${className || ''}`}>
      <table className="min-w-full table-auto">
        <thead className="border-b border-gray-200 bg-gray-50">
          {table?.getHeaderGroups()?.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup?.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    'px-6 py-4 text-xs font-semibold text-gray-500 uppercase last:text-right'
                  )}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table && table?.getRowModel()?.rows?.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-sm">
                <div className="mb-2 flex w-full items-center justify-center">
                  <FileText className="size-8 text-gray-400" />
                </div>
                <p className="text-gray-400">No data available</p>
              </td>
            </tr>
          ) : (
            table?.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-200 transition-colors hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-2 text-xs font-medium text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
