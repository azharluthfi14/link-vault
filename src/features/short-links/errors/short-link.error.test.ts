import { describe, expect, it } from 'vitest';

import { ShortLinkExpiredError } from './short-link.error';

describe('Shortlink error', () => {
  it('Should return short link expired status', () => {
    const err = new ShortLinkExpiredError('abc');

    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('SHORT_LINK_EXPIRED');
    expect(err.statusCode).toBe(410);
    expect(err.details).toEqual({ id: 'abc' });
  });
});
