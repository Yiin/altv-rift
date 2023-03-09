import { isRef, reactive, ref, toRaw, unref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { get, set } from "lodash-es";
import { createPinia, defineStore } from "pinia";

const pinia = createPinia();
const clientPinia = createPinia();

type State = {
  inventory: { name: string; quantity: number }[];
  map: Map<string, string>;
  foo?: string;
};

const useStore = defineStore("inventory", {
  state: (): State => ({
    inventory: [],
    map: new Map(),
  }),
});
const useX = defineStore("x", {
  state: (): State => ({} as State),
});

const store = useStore(pinia);
let x = useX(clientPinia);

store.$subscribe(
  (mutation, state) => {
    if (!mutation.events) {
      x.$state = structuredClone(toRaw(state));
      return;
    }
    const events = Array.isArray(mutation.events)
      ? mutation.events
      : [mutation.events];

    for (const event of events) {
      const path = findPath(toRaw(state), event?.target)?.join(".");
      // if (path?.startsWith("inventory") || event.key === "inventory") {
      const { type, target, key, newValue } = event;
      switch (type) {
        case "add":
          if (path) {
            set(x.$state, path, target);
          } else {
            x.$state = target as any;
          }
          break;
        case "set":
          set(x.$state, `${path ? path + "." : ""}${key}`, newValue);
          break;
        case "delete":
          delete (path ? get(x.$state, path) : x.$state)[key];
          break;
        case "clear":
          (path ? get(x.$state, path) : x.$state)?.clear();
          break;
      }
      // }
    }
  },
  { immediate: true }
);

const wait = () => new Promise((resolve) => setImmediate(resolve));

function* steps() {
  yield (store.inventory = [{ name: "a", quantity: 1 }]);
  yield (store.inventory.push({ name: "a", quantity: 1 }),
  store.inventory.push({ name: "c", quantity: 1 }));
  yield store.inventory[0].quantity++;
  yield store.inventory.splice(1, 1);
  yield store.$patch({
    foo: "bar",
  });
  yield (store.inventory = [{ name: "d", quantity: 1 }]);
  yield delete store.foo;
  yield store.$reset();
  yield store.map.set("a", "b");
  yield store.map.clear();
}

(async () => {
  for (const i of steps()) {
    await wait();
    console.log(
      JSON.stringify(x.$state) === JSON.stringify(store.$state),
      x.$state
    );
  }
})();

// function that searched for an value in object recursively and returns the path to the value
function findPath(obj: any, value: any, path: string[] = []): string[] | null {
  if (obj === value) {
    return path;
  }
  if (typeof obj === "object") {
    for (const key in obj) {
      const result = findPath(obj[key], value, path.concat(key));
      if (result) {
        return result;
      }
    }
  }
  return null;
}
