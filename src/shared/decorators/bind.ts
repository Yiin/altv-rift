import { container } from "@shared/ioc-container";
import { logger } from "@shared/logger";
import { injectable } from "inversify";

export const bind =
  () =>
  <T>(target: new (...args: never[]) => T) => {
    try {
      const injectableTarget = injectable()(target);
      container.bind(injectableTarget).to(injectableTarget).inSingletonScope();
      logger.info(`[Module loaded] ${target.name}`);
    } catch (e) {
      logger.error(`[Module failed to load] ${target.name}`);
    }
  };
