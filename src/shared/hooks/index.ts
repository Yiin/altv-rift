type HookableFunctionOptions<F extends (...args: any) => any> = {
  name?: string;
  defaultReturn?: ReturnType<F>;
  onResult?: (result: ReturnType<F>, args: Parameters<F>) => void;
};

type HookFunction<F extends (...args: any) => any> = (
  ...args: Parameters<F>
) => ReturnType<F> | void;

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
  options: HookableFunctionOptions<F> = { defaultReturn: undefined as ReturnType<F> }
): Hookable<F> {
  const handlers: HookFunction<F>[] = [];

  const hook = (handler: HookFunction<F>) => {
    handlers.push(handler);
  };

  const call = (...args: Parameters<F>): ReturnType<F> => {
    for (const handler of handlers) {
      const result = handler(...args);
      if (typeof result !== "undefined") {
        console.log(
          `[HookableFunction] ${options.name} hook returned ${JSON.stringify(result)}`
        );
        options.onResult?.(result, args);
        return result;
      }
    }
    console.log(
      `[HookableFunction] ${options.name} hook returned default value ${options.defaultReturn}}`
    );
    options.onResult?.(options.defaultReturn as ReturnType<F>, args);
    return options.defaultReturn as ReturnType<F>;
  };

  return {
    hook,
    call,
  };
}
