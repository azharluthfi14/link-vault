import { describe, expect, it } from 'vitest';

import {
  createShortLinkSchema,
  listShortLinkQueryParamsSchema,
  updateShortLinkSchema,
} from './short-link.schema';

describe('createShortLinkSchema', () => {
  const basePayload = {
    originalUrl: 'https://example.com',
  };

  it('Should be pass create short link with minimal valid input', () => {
    const result = createShortLinkSchema.safeParse(basePayload);
    expect(result.success).toBe(true);
  });

  it('Should reject create short link without url input', () => {
    const result = createShortLinkSchema.safeParse({
      ...basePayload,
      originalUrl: '',
    });
    expect(result.success).toBe(false);
  });

  it('Should allow valid slug', () => {
    const result = createShortLinkSchema.safeParse({
      ...basePayload,
      slug: 'test-slug-123',
    });
    expect(result.success).toBe(true);
  });

  it('Should reject reserved slug', () => {
    const result = createShortLinkSchema.safeParse({
      ...basePayload,
      slug: 'api',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.slug?.[0]).toBe(
        'This slug is reserved and cannot be used'
      );
    }
  });

  it('Should reject invalid url', () => {
    const result = createShortLinkSchema.safeParse({
      originalUrl: 'invalid-url',
    });

    expect(result.success).toBe(false);
  });

  it('Should reject expired date in the past', () => {
    const pastDate = new Date(Date.now() - 1000).toISOString();

    const result = createShortLinkSchema.safeParse({
      ...basePayload,
      expiresAt: pastDate,
    });

    expect(result.success).toBe(false);
  });

  it('Should accept future expiration date', () => {
    const futureDate = new Date(Date.now() + 60_000).toISOString();

    const result = createShortLinkSchema.safeParse({
      ...basePayload,
      expiresAt: futureDate,
    });

    expect(result.success).toBe(true);
  });

  it('Should coerce maxClicks to number', () => {
    const result = createShortLinkSchema.parse({
      ...basePayload,
      maxClicks: '100',
    });

    expect(result.maxClicks).toBe(100);
  });
});

describe('updateShortLinkSchema', () => {
  it('Should allow empty object', () => {
    const result = updateShortLinkSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('Should validate provided fields only', () => {
    const result = updateShortLinkSchema.safeParse({
      slug: 'edit-slug-1',
    });

    expect(result.success).toBe(true);
  });

  it('Should reject reserved slug on update', () => {
    const result = updateShortLinkSchema.safeParse({
      slug: 'home',
    });

    expect(result.success).toBe(false);
  });
});

describe('listShortLinkQueryParamsSchema', () => {
  it('Should apply default values', () => {
    const result = listShortLinkQueryParamsSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it('Should coerce page and limit', () => {
    const result = listShortLinkQueryParamsSchema.parse({
      page: '2',
      limit: '20',
    });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(20);
  });

  it('Should reject invalid status', () => {
    const result = listShortLinkQueryParamsSchema.safeParse({
      status: 'unknown',
    });

    expect(result.success).toBe(false);
  });

  it('Should reject empty search string', () => {
    const result = listShortLinkQueryParamsSchema.safeParse({
      search: '',
    });

    expect(result.success).toBe(false);
  });
});
