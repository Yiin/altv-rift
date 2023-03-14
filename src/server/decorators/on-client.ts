import alt from "alt-server";
import { container } from "@shared/ioc-container";
import { EventFromClient } from "@shared/events/server/from-client";
import { logger } from "@/logger";

type MethodDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

type ClientEvent = Asyncify<EventFromClient>;

export const onClient =
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

        alt.onClient(eventName, handler);
        logger.info(`[Event bound] ${eventName}`);
      } catch (e) {
        logger.error(`[Event failed to bind] ${eventName}`);
        console.log(e);
      }
    });
  };
