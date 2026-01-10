import { useQuery } from '@tanstack/react-query';

import type { LinkListQueryParams, ShortLink } from '@/features/short-links';

type ShortLinkListResponse = {
  items: ShortLink[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function useShortLinks(params?: Partial<LinkListQueryParams>) {
  return useQuery<ShortLinkListResponse>({
    queryKey: ['short-links', params],
    queryFn: async () => {
      const qs = new URLSearchParams(
        params as Record<string, string>
      ).toString();

      const res = await fetch(`/api/short-links?${qs}`);

      if (!res.ok) {
        throw new Error('FAILED_TO_FETCH_SHORT_LINKS');
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
