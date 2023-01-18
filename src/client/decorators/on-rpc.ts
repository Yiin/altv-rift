import { captureException } from "@sentry/node";
import rpc from "altv-rpc";
import { container } from "@shared/ioc-container";

type MethodDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

export const onRpc =
  (eventName: string): MethodDecorator<ClientTriggerListener> =>
  (target, propertyKey) => {
    setImmediate(() => {
      const service = container.get<any>(target.constructor);
      try {
        rpc.on(eventName, async (...args) => {
          try {
            await service[propertyKey](...args);
          } catch (e) {
            captureException(e);
          }
        });
      } catch (e) {
        captureException(e);
      }
    });
  };
