import { captureException } from "@sentry/node";
import { container } from "@shared/ioc-container";
import { rpc } from "@/rpc";

type MethodDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

export const clientRpc =
  <K extends string>(eventName: K): MethodDecorator<any> =>
  (target, propertyKey) => {
    setImmediate(() => {
      const service = container.get<any>(target.constructor);
      try {
        rpc.registerClient(eventName, service[propertyKey]);
      } catch (e) {
        captureException(e);
      }
    });
  };
