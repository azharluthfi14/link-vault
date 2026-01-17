import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockShortLinkRepository } from '../repositories/__mocks__/short-link.repo';
import type { ComputedStatus, ShortLink } from '../types';
import { ShortLinkServices } from './short-link.service';

type BaseLinkTest = {
  name: string;
  input: {
    status?: ComputedStatus;
    page: number;
    limit: number;
  };
  expectedIds: string[];
  total: number;
};

const mockDbLinks: ShortLink[] = [
  {
    id: '1',
    userId: 'user-1',
    status: 'active',
    expiresAt: new Date(Date.now() - 1000),
    clicks: 0,
    maxClicks: null,
    slug: 'a',
    originalUrl: 'x',
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: '2',
    userId: 'user-1',
    status: 'active',
    expiresAt: null,
    clicks: 10,
    maxClicks: 10,
    slug: 'b',
    originalUrl: 'x',
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: '3',
    userId: 'user-1',
    status: 'disabled',
    expiresAt: null,
    clicks: 0,
    maxClicks: null,
    slug: 'c',
    originalUrl: 'x',
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: '4',
    userId: 'user-1',
    status: 'active',
    expiresAt: null,
    clicks: 1,
    maxClicks: 10,
    slug: 'd',
    originalUrl: 'x',
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

const cases = [
  {
    name: 'no status filter',
    input: { status: undefined, page: 1, limit: 10 },
    expectedIds: ['1', '2', '3', '4'],
    total: 4,
  },
  {
    name: 'filter expired',
    input: { status: 'expired', page: 1, limit: 10 },
    expectedIds: ['1', '2'],
    total: 2,
  },
  {
    name: 'filter active',
    input: { status: 'active', page: 1, limit: 10 },
    expectedIds: ['4'],
    total: 1,
  },
  {
    name: 'filter disabled',
    input: { status: 'disabled', page: 1, limit: 10 },
    expectedIds: ['3'],
    total: 1,
  },
  {
    name: 'expired page 2 limit 1',
    input: { status: 'expired', page: 2, limit: 1 },
    expectedIds: ['2'],
    total: 2,
  },
  {
    name: 'disabled beats expired',
    input: { status: 'disabled', page: 1, limit: 10 },
    expectedIds: ['3'],
    total: 1,
  },
] satisfies BaseLinkTest[];

describe('ShortLinkService', () => {
  const service = new ShortLinkServices({
    repo: mockShortLinkRepository,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  mockShortLinkRepository.listByUser.mockResolvedValue(mockDbLinks);
  mockShortLinkRepository.countByUser.mockImplementation(
    async (_userId, _search, status) => {
      if (status === 'disabled') return 1;
      return mockDbLinks.length;
    }
  );

  it.each(cases)('$name', async ({ input, expectedIds, total }) => {
    const result = await service.listByUser({
      userId: 'user-1',
      search: undefined,
      ...input,
    });

    expect(result.items.map((i) => i.id)).toEqual(expectedIds);
    expect(result.meta.total).toBe(total);
  });
});
