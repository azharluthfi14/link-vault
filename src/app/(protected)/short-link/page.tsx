import { BarChart3, Link } from 'lucide-react';

import { getSession } from '@/libs/auth/get-session';

import { TableLink } from './components/table-link';

export default async function ShortLinkPage() {
  return (
    <div className="h-full min-h-screen space-y-8 bg-gray-50">
      <div>
        <h1 className="mb-2 text-3xl font-semibold">Your Links</h1>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            <span>
              <strong className="text-gray-900">100</strong> total links
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>
              <strong className="text-gray-900">{100}</strong> total clicks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              <strong className="text-green-600">active</strong> active
            </span>
          </div>
        </div>
      </div>
      <TableLink userId={''} />
    </div>
  );
}
