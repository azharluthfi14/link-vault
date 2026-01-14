import { notFound, redirect } from 'next/navigation';

import { RESERVED_ROUTES } from '@/constants';
import { getShortLinkService } from '@/features/short-links/services';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RedirectSlugLinkPage(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

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

export const revalidate = 3600;
export const dynamicParams = true;
