import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthError, AuthErrorCode } from '@/libs/auth/auth-error';
import { getSession } from '@/libs/auth/get-session';

import { ShortLinkError, ShortLinkErrorCode } from '../errors';
import type { CreateShortLinkSchemaInput } from '../schemas';
import { getShortLinkService } from '../services';
import { mapShortLinkError } from '../utils';
import {
  createShortLinkAction,
  deleteShortLinkAction,
  updateShortLinkAction,
} from './short-link.action';

type ShortLinkService = ReturnType<typeof getShortLinkService>;

function mockShortLinkService(
  overrides?: Partial<ShortLinkService>
): ShortLinkService {
  return {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  } as ShortLinkService;
}

vi.mock('@/libs/auth/get-session');
vi.mock('../services', () => ({
  getShortLinkService: vi.fn(),
}));
vi.mock('../utils', () => ({
  mapShortLinkError: vi.fn(),
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

  const mockShortLink = {
    id: 'id-test-shortlink',
    slug: 'test-slug',
    originalUrl: 'https://example.com',
    userId: 'id-test-user',
    clicks: 0,
    maxClicks: null,
    description: null,
    expiresAt: null,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue(mockAuthUser);
  });

  describe('Create short link action', () => {
    const mockCreate = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(getShortLinkService).mockReturnValue(
        mockShortLinkService({
          create: mockCreate,
        })
      );
    });

    function buildCreateFormData(data: Partial<CreateShortLinkSchemaInput>) {
      const base = {
        slug: 'test-slug',
        originalUrl: 'https://example.com',
      };

      const formData = new FormData();

      Object.entries({ ...base, ...data }).forEach(([key, value]) => {
        if (value === undefined) return;

        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      });

      return formData;
    }

    it('Should return UNAUTHENTICATED when session is missing', async () => {
      vi.mocked(getSession).mockRejectedValueOnce(
        new AuthError(AuthErrorCode.UNAUTHENTICATED)
      );

      const formData = new FormData();
      formData.append('originalUrl', 'https://example.com');

      const result = await createShortLinkAction(null, formData);
      expect(result.success).toBe(false);
      expect(!result.success && result.code).toBe('UNAUTHENTICATED');
    });

    it('Should map service error correctly', async () => {
      mockCreate.mockRejectedValue(
        new ShortLinkError(ShortLinkErrorCode.SLUG_ALREADY_EXISTS)
      );

      vi.mocked(mapShortLinkError).mockReturnValue({
        success: false,
        code: ShortLinkErrorCode.SLUG_ALREADY_EXISTS,
        message: 'Slug already exists',
      });

      const formData = buildCreateFormData({
        slug: 'test-slug',
        originalUrl: 'https://example.com',
      });

      const result = await createShortLinkAction(null, formData);
      expect(result.success).toBe(false);
      expect(mapShortLinkError).toHaveBeenCalled();
    });

    it('Should create new short link successfully', async () => {
      mockCreate.mockResolvedValue(mockShortLink);
      const formData = buildCreateFormData({
        slug: 'test-slug',
        originalUrl: 'https://example.com',
      });

      const result = await createShortLinkAction(null, formData);
      expect(result).toEqual({
        success: true,
        data: mockShortLink,
        message: 'Success create short link',
      });
      expect(mockCreate).toHaveBeenCalledWith('id-test-user', {
        originalUrl: 'https://example.com',
        slug: 'test-slug',
      });
    });

    it('Should create new short link with all optional field', async () => {
      const expiresAt = new Date('2026-12-31T23:59:59.999Z');

      mockCreate.mockResolvedValue({
        ...mockShortLink,
        maxClicks: 100,
        expiresAt,
        description: 'Test description',
      });

      const formData = buildCreateFormData({
        originalUrl: 'https://example.com',
        slug: 'test-slug',
        maxClicks: 100,
        expiresAt,
        description: 'Test description',
      });

      const result = await createShortLinkAction(null, formData);

      expect(result.success).toBe(true);
      expect(mockCreate).toHaveBeenCalledWith('id-test-user', {
        originalUrl: 'https://example.com',
        slug: 'test-slug',
        maxClicks: 100,
        expiresAt,
        description: 'Test description',
      });
    });

    it('Should return validation error when slug is reserved', async () => {
      const formData = buildCreateFormData({
        slug: 'home',
        originalUrl: 'https://example.com',
      });

      const result = await createShortLinkAction(null, formData);

      expect(result.success).toBe(false);
      expect(!result.success && result.code).toBe('VALIDATION_ERROR');
      expect(
        !result.success &&
          result.code === 'VALIDATION_ERROR' &&
          result.fieldErrors?.slug
      ).toBeDefined();
    });
  });

  describe('Update short link action', () => {
    const mockUpdate = vi.fn();
    beforeEach(() => {
      vi.mocked(getShortLinkService).mockReturnValue(
        mockShortLinkService({
          update: mockUpdate,
        })
      );
    });

    it('Should return UNAUTHENTICATED when session is missing', async () => {
      vi.mocked(getSession).mockRejectedValueOnce(
        new AuthError(AuthErrorCode.UNAUTHENTICATED)
      );

      const formData = new FormData();
      formData.append('originalUrl', 'https://example.com');

      const result = await updateShortLinkAction(null, formData);
      expect(result.success).toBe(false);
      expect(!result.success && result.code).toBe('UNAUTHENTICATED');
    });

    it('Should return validation error when id missing on update', async () => {
      const formData = new FormData();
      formData.append('description', 'Update');

      const result = await updateShortLinkAction(null, formData);

      expect(result.success).toBe(false);
      expect(!result.success && result.code).toBe('VALIDATION_ERROR');
    });

    it('Should update short link', async () => {
      mockUpdate.mockResolvedValue({
        ...mockShortLink,
        description: 'Update description',
      });

      const formData = new FormData();
      formData.append('id', 'id-test-shortlink');
      formData.append('description', 'Update description');

      const result = await updateShortLinkAction(null, formData);

      expect(result.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        'id-test-user',
        'id-test-shortlink',
        {
          description: 'Update description',
        }
      );
    });
  });

  describe('Delete short link action', () => {
    const mockDelete = vi.fn();
    beforeEach(() => {
      vi.mocked(getShortLinkService).mockReturnValue(
        mockShortLinkService({
          delete: mockDelete,
        })
      );
    });

    it('Should return UNAUTHENTICATED when session is missing', async () => {
      vi.mocked(getSession).mockRejectedValueOnce(
        new AuthError(AuthErrorCode.UNAUTHENTICATED)
      );

      const formData = new FormData();
      formData.append('originalUrl', 'https://example.com');

      const result = await deleteShortLinkAction(null, formData);
      expect(result.success).toBe(false);
      expect(!result.success && result.code).toBe('UNAUTHENTICATED');
    });

    it('Should return validation error when id missing on delete', async () => {
      const formData = new FormData();

      const result = await deleteShortLinkAction(null, formData);

      expect(result.success).toBe(false);
      expect(!result.success && result.code).toBe('VALIDATION_ERROR');
    });

    it('Should delete short link action', async () => {
      mockDelete.mockResolvedValue(true);

      const formData = new FormData();
      formData.append('id', 'id-test-shortlink');

      const result = await deleteShortLinkAction(null, formData);

      expect(result.success).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith(
        'id-test-user',
        'id-test-shortlink'
      );
    });
  });
});
