import dns from "dns";

const DefaultViteServer = "127.0.0.1";
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
