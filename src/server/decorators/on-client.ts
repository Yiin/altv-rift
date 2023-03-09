import alt, { IClientEvent } from "alt-server";
import { container } from "@shared/ioc-container";
import { logger } from "@/logger";

type MethodDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

export const onClient =
  <K extends keyof IClientEvent>(
    eventName: K
  ): MethodDecorator<IClientEvent[K]> =>
  (target, propertyKey) => {
    setImmediate(() => {
      try {
        const service = container.get<any>(target.constructor);
        const handler: IClientEvent[K] = (...args: any[]) => {
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
