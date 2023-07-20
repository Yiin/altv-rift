import { AnchorType } from "./anchors";
import { ElementRegistration } from "./types";

// List of all registered elements
export const registeredElements = new Map<
  string,
  ElementRegistration<AnchorType>
>();

// Register an element
export const registerElement = <T extends AnchorType>(
  registration: ElementRegistration<T>
) => {
  registeredElements.set(registration.key, registration);
};
