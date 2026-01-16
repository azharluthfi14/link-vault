import { getSummaryHomeAction } from '@/features/short-links/actions/short-link-summary.action';
import { unwrapData } from '@/libs/types/response.type';

import { StatsSummary } from './components';

export default async function HomePage() {
  const data = await getSummaryHomeAction();
  const stats = unwrapData(data);
  console.log('summary', data);

  return (
    <div className="h-full min-h-screen bg-gray-50">
      <StatsSummary stats={stats} />
    </div>
  );
}
