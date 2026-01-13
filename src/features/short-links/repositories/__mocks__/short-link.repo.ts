import { vi } from 'vitest';

export const mockShortLinkRepository = {
  findById: vi.fn(),
  findByActiveSlug: vi.fn(),
  listByUser: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  slugExists: vi.fn(),
  incrementClicks: vi.fn(),
  softDelete: vi.fn(),
  countByUser: vi.fn(),
};
