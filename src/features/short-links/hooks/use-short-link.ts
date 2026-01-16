import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type {
  ListShortLinkQueryParamsInput,
  ShortLink,
  ShortLinkListResponse,
} from '@/features/short-links';

export function useShortLinks(params?: Partial<ListShortLinkQueryParamsInput>) {
  const query = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
    ...(params?.search ? { search: params.search } : {}),
    ...(params?.status ? { status: params.status } : {}),
  };

  return useQuery<ShortLinkListResponse>({
    queryKey: ['short-links', query],
    queryFn: async () => {
      const qs = new URLSearchParams(
        Object.entries(query).map(([k, v]) => [k, String(v)])
      ).toString();

      const res = await fetch(`/api/short-links?${qs}`);

      if (!res.ok) {
        throw new Error('FAILED_TO_FETCH_SHORT_LINKS');
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useShortLinkDetail(id?: string) {
  return useQuery<ShortLink>({
    queryKey: ['short-link', id],
    queryFn: async () => {
      const res = await fetch(`/api/short-links/${id}`);
      if (!res.ok) throw new Error('Failed to fetch short link');

      const data = await res.json();
      return data;
    },
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
