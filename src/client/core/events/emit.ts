import * as alt from "@altv/client";
import { CustomClientEvent } from "@shared/events/client/from-client";

const eventHandlers = new Map<string, Function[]>();

export function on<E extends keyof CustomClientEvent>(
  eventName: E,
  handler: alt.Events.CustomEventCallback<Parameters<CustomClientEvent[E]>>
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

export function emit<E extends keyof CustomClientEvent>(
  eventName: E,
  ...args: Parameters<CustomClientEvent[E]>
) {
  const events = eventHandlers.get(eventName);

  if (events) {
    events.forEach((handler) => handler(...args));
  }
}
