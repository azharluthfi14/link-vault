import { DrizzleShortLinkRepository } from '../repositories';
import { ShortLinkServices } from './short-link.service';

const shortLinkRepo = new DrizzleShortLinkRepository();
const shortLinkService = new ShortLinkServices({ repo: shortLinkRepo });

export function getShortLinkService() {
  return shortLinkService;
}

export function createShortLinkService() {
  return new ShortLinkServices({ repo: new DrizzleShortLinkRepository() });
}
