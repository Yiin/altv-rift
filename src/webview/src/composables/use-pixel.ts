import { computed, ref } from "vue";
import { useEventListener } from "./use-event-listener";

function createRemToPxDiv() {
  const div = document.createElement("div");
  div.setAttribute("id", "rem-to-px");
  div.style.height = "1rem";
  div.style.position = "absolute";
  div.style.top = window.innerHeight + "px";
  div.style.visibility = "hidden";
  document.body.append(div);
}

export const usePixel = () => {
  const resizeTrigger = ref(0);

  const remToPx = computed(() => {
    resizeTrigger.value;

    if (!document.getElementById("rem-to-px")) {
      createRemToPxDiv();
    }

    const div = document.getElementById("rem-to-px")!;
    const px = div.getBoundingClientRect().height;

    return px / 4;
  });

  useEventListener("resize", () => {
    resizeTrigger.value ^= 1;
  });

  function px(value: number) {
    return (value * remToPx.value) / 4;
  }

  return px;
};
