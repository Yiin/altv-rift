const map = new Map<string, any>();

export function triggerIfChanged(
  key: string,
  value: any,
  callback: (value: any) => void
) {
  const previousValue = map.get(key);
  if (value !== previousValue) {
    callback(value);
    map.set(key, value);
  }
}
