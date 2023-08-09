import { AnchorType } from "./anchors";
import { ElementRegistration } from "./types";

// List of all registered elements
export const registeredElements = new Map<
  string,
  ElementRegistration<AnchorType, any>
>();

export const focusableElements = new Map<
  AnchorType,
  ElementRegistration<AnchorType, any>
>();

// Register an element
export const registerElement = <T extends AnchorType, X>(
  registration: ElementRegistration<T, X>
) => {
  if (registration.focusable) {
    const focusableElementForAnchorType = focusableElements.get(
      registration.anchorType
    );
    if (focusableElementForAnchorType) {
      throw new Error(
        `Can't register ${registration.key} as focusable element because ${
          focusableElementForAnchorType.key
        } is already registered as focusable element for ${
          AnchorType[registration.anchorType]
        }`
      );
    }
    focusableElements.set(registration.anchorType, registration);
  }
  registeredElements.set(registration.key, registration);
};
