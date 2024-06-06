const BASE_URL = import.meta.env.MODE === "production" ? window.CDN_URL : "./";

export function asset(path: string): string {
  return `${BASE_URL}${path.replace(/^\.\//, "")}`;
}
