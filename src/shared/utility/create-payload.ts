export function createPayload(name: string, args?: any[]) {
  const id = Date.now() + Math.random().toString(16).substring(2, 9);
  return { id, name, args };
}
