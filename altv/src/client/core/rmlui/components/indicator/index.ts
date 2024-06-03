import { div, img } from "../../renderer/rml-tags";
import { ParsedElement } from "../../renderer/types";

export function Indicator(): ParsedElement {
  return div(
    {
      className: "indicator",
    },
    [
      div(
        {
          className: "indicator__glow-wrapper",
        },
        [
          img({
            className: "indicator__glow",
            src: `components/indicator/assets/indicator-glow.png`,
          }),
        ],
      ),
      img({
        className: "indicator__dot",
        src: `components/indicator/assets/indicator_dot.png`,
        // src: `components/indicator/assets/keyboard-mouse/light/W.png`,
      }),
    ],
  );
}
