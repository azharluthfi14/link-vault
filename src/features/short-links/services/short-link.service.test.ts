import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ShortLinkErrorCode } from '../errors';
import { mockShortLinkRepository } from '../repositories/__mocks__/short-link.repo';
import type { ShortLinkRepository } from '../types';
import { ShortLinkServices } from './short-link.service';

describe('ShortLinkService', () => {
  let service: ShortLinkServices;

  const userId = 'test-user-1';
  const otherUserId = 'test-user-2';
  const linkId = 'link-1';

  const baseLink = {
    id: linkId,
    userId,
    slug: 'test-link',
    deletedAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new ShortLinkServices({
      repo: mockShortLinkRepository as ShortLinkRepository,
    });
  });

  describe('update()', () => {
    it('Should update short link when user owns the link', async () => {
      mockShortLinkRepository.findById.mockResolvedValue(baseLink);
      mockShortLinkRepository.update.mockResolvedValue({
        ...baseLink,
        slug: 'updated',
      });

      const result = await service.update(userId, linkId, {
        slug: 'updated',
      });

      expect(mockShortLinkRepository.findById).toHaveBeenCalledWith(linkId);
      expect(mockShortLinkRepository.update).toHaveBeenCalledWith(linkId, {
        slug: 'updated',
        status: 'active',
      });
      expect(result.slug).toBe('updated');
    });

    it('Should throw NOT_FOUND if link does not exist', async () => {
      mockShortLinkRepository.findById.mockResolvedValue(null);

      await expect(service.update(userId, linkId, {})).rejects.toMatchObject({
        code: ShortLinkErrorCode.NOT_FOUND,
      });
    });

    it('Should throw FORBIDDEN if user is not owner', async () => {
      mockShortLinkRepository.findById.mockResolvedValue({
        ...baseLink,
        userId: otherUserId,
      });

      await expect(service.update(userId, linkId, {})).rejects.toMatchObject({
        code: ShortLinkErrorCode.FORBIDDEN,
      });
    });
  });

  describe('delete()', () => {
    it('Should soft delete short link', async () => {
      mockShortLinkRepository.findById.mockResolvedValue(baseLink);
      mockShortLinkRepository.softDelete.mockResolvedValue(undefined);

      await service.delete(userId, linkId);

      expect(mockShortLinkRepository.softDelete).toHaveBeenCalledWith(linkId);
    });

    it('Should throw NOT_FOUND if already deleted', async () => {
      mockShortLinkRepository.findById.mockResolvedValue({
        ...baseLink,
        deletedAt: new Date(),
      });

      await expect(service.delete(userId, linkId)).rejects.toMatchObject({
        code: ShortLinkErrorCode.NOT_FOUND,
      });
    });
  });
});
