import alt from "alt-client";
import { container } from "@shared/ioc-container";
import { EventFromServer } from "@shared/events/client/from-server";

type MethodDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

type ServerEvent = Asyncify<EventFromServer>;

export const onServer =
  <K extends keyof ServerEvent>(
    eventName: K
  ): MethodDecorator<ServerEvent[K]> =>
  (target, propertyKey) => {
    alt.setTimeout(() => {
      try {
        const service = container.get<any>(target.constructor);
        const handler: ServerEvent[K] = (...args: any[]) => {
          try {
            const ret = service[propertyKey](...args);
            if (typeof ret === "object" && typeof ret.catch === "function") {
              ret.catch(alt.logError);
            }
          } catch (e) {
            alt.logError(e);
          }
        };

        alt.onServer(eventName, handler);
        alt.log(`[onServer bound] ${eventName}`);
      } catch (e) {
        alt.log(`[onServer failed to bind] ${eventName}`);
        console.log(e);
      }
    }, 0);
  };
