import { useActionState, useTransition } from 'react';

export function useResettableActionState<State, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
  permalink?: string
): [
  state: Awaited<State>,
  dispatch: (payload: Payload | null) => void,
  isPending: boolean,
  reset: () => void,
] {
  const [isPending, startTransition] = useTransition();

  const [state, submit, isActionPending] = useActionState(
    async (state: Awaited<State>, payload: Payload | null) => {
      if (!payload) {
        return initialState;
      }
      const data = await action(state, payload);
      return data;
    },
    initialState,
    permalink
  );

  const reset = () => {
    startTransition(() => {
      submit(null);
    });
  };

  const combinedPending = isPending || isActionPending;

  return [state, submit, combinedPending, reset];
}
