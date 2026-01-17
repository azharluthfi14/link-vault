'use client';

import { Card, CardBody } from '@heroui/react';
import type { ReactNode } from 'react';

import { cn } from '@/utils';

interface CardSummaryProps {
  label: string;
  value: number;
  icon: ReactNode;
  iconColor?: string;
  bgColor?: string;
}

export const CardSummary = ({
  icon,
  label,
  value,
  iconColor = 'text-gray-600',
  bgColor = 'bg-gray-200',
}: CardSummaryProps) => {
  return (
    <Card shadow="none" radius="sm" className="border border-gray-200 p-2">
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-sm font-semibold text-gray-500">{label}</h1>
            <h1 className="text-3xl font-bold text-gray-800">{value}</h1>
          </div>
          <div
            className={cn(
              'grid size-10 place-content-center rounded-md',
              bgColor
            )}>
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
