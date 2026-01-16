import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSession } from '@/libs/auth/get-session';
import { UnauthorizedError } from '@/libs/errors/base.error';

import {
  createShortLinkAction,
  deleteShortLinkAction,
  updateShortLinkAction,
} from './short-link.action';

const mockCreate = vi.fn(async (input) => {
  return {
    id: '1',
    originalUrl: input.originalUrl || 'https://example.com',
  };
});

const mockUpdate = vi.fn(async (shortLinkId, input) => {
  return {
    id: shortLinkId,
    slug: input.slug || 'updated-slug',
    originalUrl: input.originalUrl || 'https://example.com/updated',
  };
});

const mockDelete = vi.fn(async () => {
  return { success: true };
});

vi.mock('@/libs/auth/get-session');
vi.mock('../services', () => ({
  getShortLinkService: () => ({
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  }),
}));

describe('ShortLinkAction', () => {
  const mockAuthUser = {
    user: {
      id: 'id-test-user',
      email: 'test@exaample.com',
      name: 'Test User',
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    session: {
      id: 'session-123',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'id-test-user',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      token: 'token-123',
      ipAddress: null,
      userAgent: null,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue(mockAuthUser);
  });

  function buildFormData(data: Record<string, unknown>) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) return;
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });
    return formData;
  }

  const cases = [
    {
      name: 'Create short link',
      action: () =>
        createShortLinkAction(
          null,
          buildFormData({ originalUrl: 'https://api.com' })
        ),
      serviceSpy: () => mockCreate,
      expected: {
        id: '1',
        originalUrl: 'https://api.com',
      },
    },
    {
      name: 'Update short link',
      action: () =>
        updateShortLinkAction(
          null,
          buildFormData({
            id: '1',
            slug: 'updated-slug',
            originalUrl: 'https://example.com/updated',
          })
        ),
      serviceSpy: () => mockUpdate,
      expected: {
        id: '1',
        slug: 'updated-slug',
        originalUrl: 'https://example.com/updated',
      },
    },
    {
      name: 'Delete short link',
      action: () => deleteShortLinkAction(null, buildFormData({ id: 1 })),
      serviceSpy: () => mockDelete,
      expected: {
        success: true,
      },
    },
  ];

  describe('UNAUTHENTICATED actions', () => {
    it.each(cases)('$name -> UNAUTHORIZED', async ({ action }) => {
      vi.mocked(getSession).mockRejectedValueOnce(
        new UnauthorizedError('Authentication required')
      );

      const result = await action();

      expect(result).toMatchObject({
        success: false,
        code: 'UNAUTHORIZED',
        error: 'Authentication required',
        showToast: true,
      });
    });
  });

  describe('AUTHENTICATED actions', () => {
    it.each(cases)(
      '$name -> Success action',
      async ({ action, serviceSpy }) => {
        vi.mocked(getSession).mockResolvedValueOnce(mockAuthUser);

        const result = await action();

        expect(result).toMatchObject({
          success: true,
        });

        expect(serviceSpy()).toHaveBeenCalledTimes(1);
      }
    );
  });
});
