import { notFound, redirect } from 'next/navigation';

import { RESERVED_ROUTES } from '@/constants';
import {
  DrizzleShortLinkRepository,
  ShortLinkServices,
} from '@/features/short-links';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const service = new ShortLinkServices({
  repo: new DrizzleShortLinkRepository(),
});

export default async function RedirectSlugLinkPage(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  if (RESERVED_ROUTES.includes(slug?.toLowerCase())) {
    notFound();
  }

  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
    notFound();
  }

  const link = await service.getByActiveSlug(slug).catch(() => notFound());

  await service.recordClick(link.id);
  redirect(link.originalUrl);
}

export const revalidate = 3600;
export const dynamicParams = true;
