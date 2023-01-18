import alt, { IClientEvent, ICustomClientEvent } from "alt-client";
import { container } from "@shared/ioc-container";
import { logger } from "@shared/logger";

type MethodDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

type ClientEvent = ICustomClientEvent & IClientEvent;

export const handleEvent =
  <K extends keyof ClientEvent>(
    eventName: K
  ): MethodDecorator<ClientEvent[K]> =>
  (target, propertyKey) => {
    setImmediate(() => {
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

        alt.on(eventName as any, handler);
        logger.info(`[Event bound] ${eventName}`);
      } catch (e) {
        logger.error(`[Event failed to bind] ${eventName}`);
        console.log(e);
      }
    });
  };
