'use client';

import type { ShortLinkSummary } from '@/features/short-links';

interface StatsSummaryProps {
  stats: ShortLinkSummary;
}

export const StatsSummary = ({ stats }: StatsSummaryProps) => {
  const { activeLinks, expiredLinks, totalClicks, totalLinks, clicksChart } =
    stats;

  const cards = [
    { label: 'Total Links', value: totalLinks },
    { label: 'Active Links', value: activeLinks },
    { label: 'Inactive Links', value: expiredLinks },
    { label: 'Total Clicks', value: totalClicks },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-lg p-4 shadow-md`}>
          <div className="text-lg font-semibold">{card.label}</div>
          <div className="mt-2 text-2xl font-bold">{card.value}</div>
        </div>
      ))}
    </div>
  );
};
