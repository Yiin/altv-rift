import { px, rem } from "../../renderer/pixel";
import { ElementProps } from "../../renderer/rml-renderer";
import { div, img } from "../../renderer/rml-tags";
import { ParsedElement } from "../../renderer/types";

export type IconName =
  // @index(['./assets/*.png'], (f, _, e) => `| "${f.name.replace('icon-', '')}"`)
  | "axe-cooldown"
  | "axe"
  | "b"
  | "car-bonnet"
  | "car-door"
  | "car-trunk"
  | "contraband"
  | "dialog"
  | "mouse-wheel-down"
  | "mouse-wheel-up"
  | "mouse-wheel"
  | "options"
  | "quest"
  | "shop"
  | "trade"
// @endindex

type IconProps = ElementProps & {
  sizePx?: number;
};

export function Icon(name: IconName | string, props: IconProps = {}): ParsedElement {
  const sizeStyle = {
    width: props.style?.width || rem(props.sizePx ?? 50),
    height: props.style?.height || rem(props.sizePx ?? 50),
  };

  props.style = {
    ...sizeStyle,
    ...props.style,
  };

  if (name.startsWith('key-')) {
    return div(props, [img({
      class: "icon",
      src: `components/icon/assets/keyboard-mouse/light/${name.replace('key-', '')}.png`,
      style: sizeStyle,
    })]);
  }
  return div(props, [img({
    class: "icon",
    src: `components/icon/assets/icon-${name}.png`,
    style: sizeStyle,
  })]);
}
