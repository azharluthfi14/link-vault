'use client';

import { Clock, Globe, Link, MousePointer2 } from 'lucide-react';

import type { ShortLinkSummary } from '@/features/short-links';

import { CardSummary } from './card-summary';

interface StatsSummaryProps {
  stats: ShortLinkSummary;
}

export const StatsSummary = ({ stats }: StatsSummaryProps) => {
  const { activeLinks, expiredLinks, totalClicks, totalLinks, clicksChart } =
    stats;

  const cards = [
    {
      label: 'Total Links',
      value: totalLinks,
      bgColor: 'bg-primary/20',
      icon: <Link className="text-primary size-5" />,
    },
    {
      label: 'Active Links',
      value: activeLinks,
      bgColor: 'bg-emerald-500/20',
      icon: <Globe className="size-5 text-emerald-500" />,
    },
    {
      label: 'Inactive Links',
      value: expiredLinks,
      icon: <Clock className="text-warning size-5" />,
      bgColor: 'bg-warning/20',
    },
    {
      label: 'Total Clicks',
      value: totalClicks,
      icon: <MousePointer2 className="size-5 text-violet-500" />,
      bgColor: 'bg-violet-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {cards.map((card, i) => (
        <CardSummary
          key={i}
          label={card.label}
          value={card.value}
          icon={card.icon}
          bgColor={card.bgColor}
        />
      ))}
    </div>
  );
};
