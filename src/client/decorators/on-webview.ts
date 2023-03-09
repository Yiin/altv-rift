import alt, { IWebviewEvent } from "alt-client";
import { container } from "@shared/ioc-container";
import { getWebview } from "@/utility/user-interface";

type MethodDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

export const onWebview =
  <K extends keyof IWebviewEvent>(
    eventName: K
  ): MethodDecorator<IWebviewEvent[K]> =>
  (target, propertyKey) => {
    alt.setTimeout(() => {
      try {
        const service = container.get<any>(target.constructor);
        const handler: IWebviewEvent[K] = (...args: any[]) => {
          try {
            const ret = service[propertyKey](...args);
            if (typeof ret === "object" && typeof ret.catch === "function") {
              ret.catch(alt.logError);
            }
          } catch (e) {
            alt.logError(e);
          }
        };

        getWebview().on(eventName, handler);
        alt.log(`[onServer bound] ${eventName}`);
      } catch (e) {
        alt.log(`[onServer failed to bind] ${eventName}`);
        console.log(e);
      }
    }, 0);
  };
