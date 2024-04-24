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
      length?: number;
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
): () => void {
  onSetState(toRaw(store.$state));

  return store.$subscribe(
    (mutation, state) => {
      if (!mutation.events) {
        onSetState(toRaw(state));
        return;
      }
      const events = Array.isArray(mutation.events) ? mutation.events : [mutation.events];
      // console.log(
      //   // @ts-expect-error
      //   JSON.stringify(events.map(({ effect, ...event }) => [event, effect.$$wtf])),
      // );

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
            payload = {
              type,
              path,
              key,
              newValue: deepToRaw(newValue),
              length: target && Array.isArray(target) ? target.length : undefined,
            };
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

export function updateStoreState<S extends Store>(store: S, event: StoreUpdatePayload): void {
  switch (event.type) {
    case "add": {
      const { path, target } = event;

      if (path) {
        set(store.$state, path, target);
      }
      break;
    }
    case "set": {
      const { path, key, newValue, length } = event;

      /**
       * Vue $subscribe doesn't provide enough info to determine if element was
       * removed from the array. If any other than the last element is removed,
       * vue will report that as a "set" operation for arr[removedIndex] = arr[removedIndex + 1].
       * To work around this, we check if the array is shorter than it was before and remove the
       * `key` which in this case is the index of the removed element.
       */
      if (path && length !== undefined) {
        const obj = get(store.$state, path);

        if (obj.length > length) {
          obj.splice(key, 1);
          break;
        }
      }
      set(store.$state, [path, key].filter(Boolean).join("."), newValue);
      break;
    }
    case "delete": {
      const { path, key } = event;

      if (path) {
        const obj = get(store.$state, path);

        if (!obj) {
          return;
        }

        if (obj instanceof Set || obj instanceof Map) {
          obj.delete(key);
        } else if (Array.isArray(obj)) {
          obj.splice(key, 1);
        } else {
          delete obj[key];
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
