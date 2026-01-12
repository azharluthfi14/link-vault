/* eslint-disable @typescript-eslint/no-explicit-any */

import type { LinkListQueryParams } from '@/features/short-links';

/**
 * Builds a query string array from data.
 * @param data The data used to build the query string array.
 * @returns The generated query string array.
 */
export function buildQueryArray(data: [string, string[]] | undefined): string {
  let queryArray = '';

  if (data && data[0] && data[1]) {
    data[1].reduce((acc, cur) => {
      queryArray = `${queryArray}${data[0]}[]=${encodeURIComponent(cur)}&`;

      return acc;
    }, {});
    queryArray = queryArray.substring(0, queryArray.length - 1);
  }

  return queryArray;
}

/**
 * Builds a query string from an action object.
 * @param action The action object used to build the query string.
 * @returns The generated query string.
 */
export function buildQueryString<T extends Record<string, any> | undefined>(
  action: T
) {
  if (!action) return '';

  return Object.entries(action)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) =>
      Array.isArray(v)
        ? v.map((i) => `${k}[]=${encodeURIComponent(i)}`).join('&')
        : `${k}=${encodeURIComponent(String(v))}`
    )
    .join('&');
}

export function buildPaginationQuery(params?: Partial<LinkListQueryParams>) {
  if (!params) return '';

  return buildQueryString({
    page: params.page,
    limit: params.limit,
    search: params.search || undefined,
    status: params.status,
  });
}
