import { div, img } from "../../renderer/rml-tags";
import { ParsedElement } from "../../renderer/types";

export function Indicator(): ParsedElement {
  return div(
    {
      class: "indicator",
    },
    [
      div(
        {
          class: "indicator__glow-wrapper",
        },
        [
          img({
            class: "indicator__glow",
            src: `components/indicator/assets/indicator-glow.png`,
          }),
        ],
      ),
      img({
        class: "indicator__dot",
        src: `components/indicator/assets/indicator_dot.png`,
        // src: `components/indicator/assets/keyboard-mouse/light/W.png`,
      }),
    ],
  );
}
