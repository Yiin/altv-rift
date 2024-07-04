/**
 * Example:
 * foo(): Foo
 * readonly(foo): () => Readonly<Foo>
 *
 * Used for pinia stores to make the state readonly. This is useful when store state
 * is synced for example between the client and webview and webview should not be able to
 * mutate the state.
 */

// export function readonly<T extends (...args: any[]) => any>(fn: T) {
//   return () => fn() as Readonly<ReturnType<T>>;
// }
