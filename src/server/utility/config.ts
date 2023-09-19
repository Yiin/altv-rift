const DefaultViteServer = "192.168.68.104";
const DefaultVitePort = 5173;
let isVueDebug = true;

export const Config = {
  isDevMode(): boolean {
    return true;
  },
  getViteServer(): string {
    return `http://${DefaultViteServer}:${DefaultVitePort}/client/webview/`;
  },
  getVueDebugMode(): boolean {
    return isVueDebug;
  },
};
