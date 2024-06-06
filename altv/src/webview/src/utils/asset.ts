const BASE_URL = import.meta.env.MODE === "production" ? import.meta.env.VITE_CDN_URL : "./";

console.log(`BASE_URL:`, BASE_URL, import.meta.env.MODE);

export function asset(path: string): string {
  return `${BASE_URL}${path.replace(/^\.\//, "")}`;
}
