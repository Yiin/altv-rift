export function createPayload(name: string, args?: any[]) {
  const id = Date.now().toString(16).substring(2, 9) + Math.random().toString(16).substring(2, 9);
  return { id, name, args };
}
