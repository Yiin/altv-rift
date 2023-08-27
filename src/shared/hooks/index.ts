type HookableFunctionOptions<R = any> = {
  defaultReturn?: R;
};

type HookFunction<F extends (...args: any) => any> = (
  ...args: Parameters<F>
) => ReturnType<F> | undefined;

interface Hookable<F extends (...args: any) => any> {
  /**
   * Adds a hook handler to the hookable function.
   * The handler will be called when the hookable function is invoked.
   * If the handler returns a value, the hookable function will return that value.
   */
  hook: (handler: HookFunction<F>) => void;

  /**
   * Returns the first non-undefined return value of a hook handler.
   * Falls back to `options.defaultReturn` if no handler returns a value.
   */
  call: (...args: Parameters<F>) => ReturnType<F>;
}

export function createHookableFunction<F extends (...args: any) => any>(
  options: HookableFunctionOptions<ReturnType<F>> = { defaultReturn: undefined as ReturnType<F> }
): Hookable<F> {
  const handlers: HookFunction<F>[] = [];

  const hook = (handler: HookFunction<F>) => {
    handlers.push(handler);
  };

  const call = (...args: Parameters<F>): ReturnType<F> => {
    for (const handler of handlers) {
      const result = handler(...args);
      if (typeof result !== "undefined") {
        return result;
      }
    }
    return options.defaultReturn as ReturnType<F>;
  };

  return {
    hook,
    call,
  };
}
