import { get, set } from "lodash-es";
import { Store } from "pinia";
import { TriggerOpTypes, toRaw, isRef, isReactive, isProxy, DebuggerEvent } from "@vue/reactivity";
import { findPath, findPathApproximate } from "@shared/utility/object";

export type StoreUpdatePayload =
  | {
      type: TriggerOpTypes.ADD;
      path: string | undefined;
      target: object;
    }
  | {
      type: TriggerOpTypes.SET;
      path: string | undefined;
      key: any;
      newValue: any;
    }
  | {
      type: TriggerOpTypes.DELETE;
      path: string | undefined;
      key: any;
    }
  | {
      type: TriggerOpTypes.CLEAR;
      path: string | undefined;
    };

export function subscribeToStore<T extends Store>(
  store: T,
  {
    onSetState,
    onUpdateState,
  }: {
    onSetState: (state: any) => void;
    onUpdateState: (payload: StoreUpdatePayload) => void;
  },
) {
  onSetState(toRaw(store.$state));

  return store.$subscribe(
    (mutation, state) => {
      if (!mutation.events) {
        onSetState(toRaw(state));
        return;
      }
      const events = Array.isArray(mutation.events) ? mutation.events : [mutation.events];

      for (const event of events) {
        const path =
          findPath(toRaw(state), event.target)?.join(".") ??
          findPathApproximate(toRaw(state), event.target)?.join(".");

        const { type, target, key, newValue } = event;

        let payload;
        switch (type) {
          case "add":
            payload = { type, path, target: deepToRaw(target) };
            break;
          case "set":
            payload = { type, path, key, newValue: deepToRaw(newValue) };
            break;
          case "delete":
            payload = { type, path, key };
            break;
          case "clear":
            payload = { type, path };
            break;
        }
        if (payload) {
          onUpdateState(payload);
        }
      }
    },
    { immediate: true, flush: "sync" },
  );
}

export function updateStoreState<S extends Store>(store: S, event: StoreUpdatePayload) {
  switch (event.type) {
    case "add": {
      const { path, target } = event;

      if (path) {
        set(store.$state, path, target);
      }
      break;
    }
    case "set": {
      const { path, key, newValue } = event;

      set(store.$state, `${path ? path + "." : ""}${key}`, newValue);
      break;
    }
    case "delete": {
      const { path, key } = event;

      if (path) {
        if (get(store.$state, path) instanceof Set) {
          get(store.$state, path)?.delete(key);
        } else {
          delete get(store.$state, path)[key];
        }
      } else {
        delete (store.$state as any)[key];
      }
      break;
    }
    case "clear": {
      const { path } = event;

      if (path) {
        get(store.$state, path)?.clear();
      }
      break;
    }
  }
}

export function deepToRaw<T extends Record<string, any>>(sourceObj: T): T {
  const objectIterator = (input: any): any => {
    if (Array.isArray(input)) {
      return input.map((item) => objectIterator(item));
    }
    if (isRef(input) || isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input));
    }
    if (
      input &&
      typeof input === "object" &&
      (input.constructor === Object || input.constructor === null)
    ) {
      return Object.keys(input).reduce((acc, key) => {
        acc[key as keyof typeof acc] = objectIterator(input[key]);
        return acc;
      }, {} as T);
    }
    return input;
  };

  return objectIterator(sourceObj);
}
