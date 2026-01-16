import { DrizzleShortLinkRepository } from '../repositories';
import { ShortLinkServices } from './short-link.service';
import { ShortLinkSummaryService } from './short-link-summary.service';

const shortLinkRepo = new DrizzleShortLinkRepository();
const shortLinkService = new ShortLinkServices({ repo: shortLinkRepo });
const shortLinkSummaryService = new ShortLinkSummaryService({
  repo: shortLinkRepo,
});

export function getShortLinkService() {
  return shortLinkService;
}

export function getShortLinkSummaryService() {
  return shortLinkSummaryService;
}

export function createShortLinkService() {
  return new ShortLinkServices({ repo: new DrizzleShortLinkRepository() });
}
