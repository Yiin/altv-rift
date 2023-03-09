import alt, { IServerEvent, type ICustomServerEvent } from "alt-server";
import { container } from "@shared/ioc-container";
import { logger } from "@/logger";

type TypedMethodDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

type ServerEvent = Asyncify<ICustomServerEvent & IServerEvent>;

export const on =
  <K extends keyof ServerEvent>(
    eventName: K
  ): TypedMethodDecorator<ServerEvent[K]> =>
  (target, propertyKey) => {
    setImmediate(() => {
      try {
        const service = container.get<any>(target.constructor);
        const handler = async (...args: any[]) => {
          try {
            return await service[propertyKey](...args);
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
