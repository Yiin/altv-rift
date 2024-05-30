import { type ObjectDirective } from "vue";

const handleWheelEvent = (event: WheelEvent) => {
  // event.preventDefault();

  if (event.currentTarget && event.currentTarget instanceof HTMLElement) {
    // Apply the vertical scroll event's delta as horizontal scroll
    const toScroll = event.deltaY;
    event.currentTarget.scrollLeft += toScroll;
  }
};

export const vHorizontalScroll: ObjectDirective<HTMLElement> = {
  mounted(el) {
    el.addEventListener("wheel", handleWheelEvent, { passive: false });
  },
  beforeUnmount(el) {
    el.removeEventListener("wheel", handleWheelEvent);
  },
};
