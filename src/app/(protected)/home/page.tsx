import { getSummaryHomeAction } from '@/features/short-links/actions/short-link-summary.action';
import { unwrapData } from '@/libs/types/response.type';

import { StatsSummary } from './components';
import { CardChart } from './components/card-chart';

export default async function HomePage() {
  const data = await getSummaryHomeAction();
  const stats = unwrapData(data);

  return (
    <div className="h-full min-h-screen space-y-6 bg-gray-50">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Analytics</h1>
        <p className="text-sm text-gray-500">
          Track your link performance and engagement
        </p>
      </div>
      <StatsSummary stats={stats} />
      <CardChart data={stats.clicksChart} />
    </div>
  );
}
