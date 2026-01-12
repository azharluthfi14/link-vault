'use server';

import { ShortLinkCLientPage } from './components';

export default async function ShortLinkPage() {
  return (
    <div className="h-full min-h-screen space-y-8 bg-gray-50">
      <div>
        <h1 className="mb-2 text-3xl font-bold">My Short Links</h1>
        <p className="text-sm text-gray-500">
          Manage all your short links in one place.
        </p>
      </div>
      <ShortLinkCLientPage />
    </div>
  );
}
