import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useTransition,
} from 'react';

type ActionResult<T> = T & {
  success?: boolean;
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

type ActionCallbacks<State> = {
  onSuccess?: (state: Awaited<State>) => void;
  onError?: (state: Awaited<State>) => void;
};

export function useResettableActionState<State, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
  callbacks?: ActionCallbacks<State>,
  permalink?: string
): [
  state: Awaited<State>,
  dispatch: (payload: Payload | null) => void,
  isPending: boolean,
  reset: () => void,
] {
  const [isPending, startTransition] = useTransition();
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const [state, submit, isActionPending] = useActionState(
    async (state: Awaited<State>, payload: Payload | null) => {
      if (!payload) {
        return initialState;
      }

      const data = await action(state, payload);

      startTransition(() => {
        const result = data as ActionResult<Awaited<State>>;

        if (result.success) {
          callbacksRef.current?.onSuccess?.(data);
        } else if (result.success === false) {
          if (result.code !== 'VALIDATION_ERROR') {
            callbacksRef.current?.onError?.(data);
          }
        }
      });

      return data;
    },
    initialState,
    permalink
  );

  const reset = useCallback(() => {
    startTransition(() => {
      submit(null);
    });
  }, [submit]);

  const combinedPending = isPending || isActionPending;

  return [state, submit, combinedPending, reset];
}
