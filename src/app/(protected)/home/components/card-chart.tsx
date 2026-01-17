'use client';

import { Card, CardBody } from '@heroui/react';
import { ChartLine } from 'lucide-react';

import { ClickLineChart } from './click-line-chart';

interface CardChartProps {
  data: {
    date: string;
    clicks: number;
  }[];
}

export const CardChart = ({ data }: CardChartProps) => {
  return (
    <Card radius="sm" shadow="none" className="border border-gray-200 p-2">
      <CardBody>
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-bold text-gray-800">Clicks Over Time</h1>
        </div>
        <ClickLineChart data={data} />
      </CardBody>
    </Card>
  );
};
