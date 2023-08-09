import fs from "fs";
import net from "net";
import * as alt from "alt-server";

interface IConfig {
  VUE_DEBUG?: string | boolean;
  USE_DEV_MODE?: boolean;
}

const DefaultServerCFGName = "server.toml";
const DefaultViteServer = "192.168.68.104";
const DefaultVitePort = 5173;
const DefaultConfigName = "ServerConfig.json";
let configCache: IConfig;
let isVueDebug = false;

export const Config = {
  get: (): IConfig => {
    // Return the cached config to prevent reading twice.
    if (configCache) {
      return configCache;
    }

    // Fetch the configuration
    if (!fs.existsSync(DefaultConfigName)) {
      alt.logWarning(`${DefaultConfigName} does not exist in root directory.`);
      alt.logWarning(
        `Please get ${DefaultConfigName} from default server files.`
      );
      process.exit(1);
    }

    let config: IConfig;

    try {
      config = JSON.parse(fs.readFileSync(DefaultConfigName).toString());
    } catch (err) {
      alt.logWarning(`${DefaultConfigName} has formatting errors.`);
      alt.logWarning(
        `Please use https://jsonlint.com/ to verify your configuration.`
      );
      process.exit(1);
    }

    const file = fs.readFileSync(DefaultServerCFGName).toString();
    if (file.includes('env = "dev"')) {
      config.USE_DEV_MODE = true;
    }

    if (config.VUE_DEBUG) {
      alt.logWarning(`Server running with Vue Debug mode on.`);
      alt.logWarning(`Open ${Config.getViteServer()} in your browser`);
      alt.logWarning(`Only a local player may connect.`);
      alt.logWarning(`Server MUST be running on a local computer`);
      isVueDebug = true;
    }

    // Finish Up
    configCache = config;
    return config;
  },
  /**
   * Check if the current server instance is running in dev mode.
   *
   * @return {boolean}
   */
  isDevMode(): boolean {
    if (!configCache || !configCache.USE_DEV_MODE) {
      return false;
    }

    return configCache.USE_DEV_MODE;
  },
  getViteServer(): string {
    return `http://${DefaultViteServer}:${DefaultVitePort}/client/webview/`;
  },
  getVueDebugMode(): boolean {
    return isVueDebug;
  },
};

Config.get();
