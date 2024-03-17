import { div, img } from "../../renderer/rml-tags";

export function Indicator() {
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
      }),
    ],
  );
}
