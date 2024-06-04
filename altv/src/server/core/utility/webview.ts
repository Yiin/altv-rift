export function getViteServer(): string {
  return `http://127.0.0.1:5173/client/webview/`;
}

export function getVueDebugMode(): boolean {
  return process.env.SERVER_ENV === "development";
}
