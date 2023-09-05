import alt from "alt-client";

export function everyFrame(
  compute: (props: { distance: number; scale: number; pos: alt.Vector3 }) => string
) {
  return {
    [Symbol.for("EVERY_FRAME")]: true,
    compute,
  };
}
