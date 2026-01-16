import { getSession } from '@/libs/auth/get-session';
import { handleAction } from '@/libs/handlers/action.handler';
import type { DataResult } from '@/libs/types/response.type';

import { getShortLinkSummaryService } from '../services';
import type { ShortLinkSummary } from '../types';

export async function getSummaryHomeAction(): Promise<
  DataResult<ShortLinkSummary>
> {
  return handleAction(async () => {
    const session = await getSession();
    const shortLinkSummaryService = getShortLinkSummaryService();
    const summary = await shortLinkSummaryService.getSummary(session.user.id);
    const clicksChart = await shortLinkSummaryService.getClicksChart(
      session.user.id,
      7
    );

    const data = {
      ...summary,
      clicksChart,
    };

    return data;
  });
}
