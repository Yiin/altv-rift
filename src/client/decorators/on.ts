import alt, { IClientEvent } from "alt-client";
import { container } from "@shared/ioc-container";

type MethodDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

type ClientEvent = IClientEvent;

export const on =
  <K extends keyof ClientEvent>(
    eventName: K
  ): MethodDecorator<ClientEvent[K]> =>
  (target, propertyKey) => {
    alt.setTimeout(() => {
      try {
        const service = container.get<any>(target.constructor);
        const handler: ClientEvent[K] = (...args: any[]) => {
          try {
            const ret = service[propertyKey](...args);
            if (typeof ret === "object" && typeof ret.catch === "function") {
              ret.catch(alt.logError);
            }
          } catch (e) {
            alt.logError(e);
          }
        };

        alt.on(eventName, handler);
        alt.log(`[Event bound] ${eventName}`);
      } catch (e) {
        alt.log(`[Event failed to bind] ${eventName}`);
        console.log(e);
      }
    }, 0);
  };
