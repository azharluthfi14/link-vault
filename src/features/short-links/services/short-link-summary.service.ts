import type { ShortLinkRepository, ShortLinkServiceDeps } from '../types';

export class ShortLinkSummaryService {
  private readonly repo: ShortLinkRepository;

  constructor(deps: ShortLinkServiceDeps) {
    this.repo = deps.repo;
  }

  async getSummary(userId: string) {
    const [totalLinks, activeLinks, disabledLinks, expiredLinks, totalClicks] =
      await Promise.all([
        this.repo.countByUser(userId),
        this.repo.countByUser(userId, undefined, 'active'),
        this.repo.countByUser(userId, undefined, 'disabled'),
        this.repo.countInactiveLinkByUser(userId),
        this.repo.sumClicks(userId),
      ]);
    return {
      totalLinks,
      activeLinks,
      disabledLinks,
      expiredLinks,
      totalClicks,
    };
  }

  async getClicksChart(userId: string, days = 7) {
    return this.repo.getClicksGroupedByDay(userId, days);
  }
}
