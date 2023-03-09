import alt from "alt-shared";
import { injectable } from "inversify";
import { container } from "@shared/ioc-container";

export const bind =
  () =>
  <T>(target: new (...args: never[]) => T) => {
    try {
      const injectableTarget = injectable()(target);
      container.bind(injectableTarget).to(injectableTarget).inSingletonScope();
      alt.log(`[Module loaded] ${target.name}`);
    } catch (e) {
      alt.log(`[Module failed to load] ${target.name}`);
    }
  };
