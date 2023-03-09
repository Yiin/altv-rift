import alt from "alt-client";
import { container } from "@shared/ioc-container";
import { rpc } from "@/rpc";

type MethodDecorator<T> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

export const webviewRpc =
  (name: string): MethodDecorator<any> =>
  (target, propertyKey) => {
    alt.setTimeout(() => {
      const service = container.get<any>(target.constructor);
      try {
        rpc.registerWebview(name, async (...args) => {
          try {
            return await service[propertyKey](...args);
          } catch (e) {
            alt.logError(e);
            throw e;
          }
        });
      } catch (e) {
        alt.logError(e);
      }
    }, 0);
  };
