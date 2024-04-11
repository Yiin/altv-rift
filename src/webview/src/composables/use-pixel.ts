import { ref } from "vue";

const pixelSize = ref<number>(0);

function createRemToPxDiv() {
  const div = document.createElement("div");
  div.setAttribute("id", "rem-to-px");
  div.style.height = "1rem";
  div.style.position = "absolute";
  div.style.top = window.innerHeight + "px";
  div.style.visibility = "hidden";
  document.body.append(div);
}

function calculatePixelSize() {
  if (!document.getElementById("rem-to-px")) {
    createRemToPxDiv();
  }

  // Wait for the next frame to get the correct height.
  // In theory it shouldn't be needed, but reality is often disappointing
  requestAnimationFrame(() => {
    const div = document.getElementById("rem-to-px")!;
    const px = div.getBoundingClientRect().height;
    pixelSize.value = px / 4;
  });
}

window.addEventListener("resize", calculatePixelSize);

calculatePixelSize();

export function px(value: number) {
  return (value * pixelSize.value) / 4;
}
