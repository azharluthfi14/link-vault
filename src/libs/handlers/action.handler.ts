import { successData, successVoid } from '../response/builders';
import { mapErrorResult } from '../response/error-mapper';
import type { DataResult, VoidResult } from '../types/response.type';

export async function handleAction<T>(
  action: () => Promise<T>
): Promise<DataResult<T>> {
  try {
    const result = await action();
    return successData(result);
  } catch (err) {
    return mapErrorResult(err);
  }
}

export async function handleVoidAction(
  action: () => Promise<void>
): Promise<VoidResult> {
  try {
    await action();
    return successVoid();
  } catch (error) {
    return mapErrorResult(error);
  }
}
