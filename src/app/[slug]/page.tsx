import { notFound, redirect } from 'next/navigation';

import { RESERVED_ROUTES } from '@/constants';
import { getShortLinkService } from '@/features/short-links/services';

type Params = Promise<{ slug: string }>;

export default async function RedirectSlugLinkPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const shortLinkService = getShortLinkService();

  if (RESERVED_ROUTES.includes(slug?.toLowerCase())) {
    notFound();
  }

  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
    notFound();
  }

  const link = await shortLinkService
    .getByActiveSlug(slug)
    .catch(() => notFound());
  await shortLinkService.recordClick(link.id);
  redirect(link.originalUrl);
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600;
