import { div, img } from "../../renderer/rml-tags";

export type IconName =
  // @index(['./assets/*.png'], (f, _, e) => `| '${f.name.replace('icon-', '')}'`)
  | "axe-cooldown"
  | "axe"
  | "car-bonnet"
  | "car-door"
  | "car-trunk"
  | "dialog"
  | "options"
  | "quest"
  | "shop"
  | "trade";
// @endindex

export function Icon(name: IconName) {
  return img({
    className: "icon",
    src: `components/icon/assets/icon-${name}.png`,
  });
}
