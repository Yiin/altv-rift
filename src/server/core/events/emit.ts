import alt from "@altv/server";
import { CustomServerEvent } from "@shared/events/server/from-server";

const eventHandlers = new Map<string, Function[]>();

export function on<E extends keyof CustomServerEvent>(
  eventName: E,
  handler: alt.Events.CustomEventCallback<Parameters<CustomServerEvent[E]>>
) {
  const events = eventHandlers.get(eventName);

  if (!events) {
    eventHandlers.set(eventName, [handler]);
  } else {
    events.push(handler);
  }

  return {
    destroy() {
      const events = eventHandlers.get(eventName);

      if (!events) {
        return;
      }

      const index = events.indexOf(handler);

      if (index !== -1) {
        events.splice(index, 1);
      }
    },
    handler,
    eventName,
  };
}

export function emit<E extends keyof CustomServerEvent>(
  eventName: E,
  ...args: Parameters<CustomServerEvent[E]>
) {
  const events = eventHandlers.get(eventName);

  if (events) {
    events.forEach((handler) => handler(...args));
  }
}
