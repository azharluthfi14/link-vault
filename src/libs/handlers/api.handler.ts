import { NextResponse } from 'next/server';

import { successData, successVoid } from '../response/builders';
import { mapErrorResult, mapResultToStatus } from '../response/error-mapper';

export async function handleApi<T>(
  action: () => Promise<T>
): Promise<NextResponse> {
  try {
    const data = await action();
    return NextResponse.json(successData(data), { status: 200 });
  } catch (err) {
    const result = mapErrorResult(err);
    return NextResponse.json(result, {
      status: mapResultToStatus(result),
    });
  }
}

export async function handleVoidApi(
  action: () => Promise<void>
): Promise<NextResponse> {
  try {
    await action();
    return NextResponse.json(successVoid(), { status: 200 });
  } catch (err) {
    const result = mapErrorResult(err);
    return NextResponse.json(result, {
      status: mapResultToStatus(result),
    });
  }
}
