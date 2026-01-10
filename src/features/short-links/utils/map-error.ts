import { ShortLinkError, ShortLinkErrorMessage } from '../errors';

export function mapShortLinkError(err: unknown) {
  if (err instanceof ShortLinkError) {
    return {
      success: false,
      code: err.code,
      message: ShortLinkErrorMessage[err.code],
    } as const;
  }

  throw err;
}
