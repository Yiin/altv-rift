import { injectable } from "inversify";
import { container } from "@shared/dependency-injection";

export const bind =
  () =>
  <T>(target: new (...args: never[]) => T) => {
    try {
      const injectableTarget = injectable()(target);
      container.bind(injectableTarget).to(injectableTarget).inSingletonScope();
      console.log(`[Module loaded] ${target.name}`);
    } catch (e) {
      console.log(`[Module failed to load] ${target.name}`, e);
    }
  };
