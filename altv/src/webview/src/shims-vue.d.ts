// declare module "*.vue" {
//   import { DefineComponent } from "vue";
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }

declare module "alt" {
  import "@altv/types-webview";
  import "@altv/types-shared";
  export default alt;
}

declare module "vue-json-viewer" {
  export default any;
}

declare module "vue-drag-resize" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<
    {
      stickSize?: number;
      parentScaleX?: number;
      parentScaleY?: number;
      isActive?: boolean;
      preventActiveBehavior?: boolean;
      isDraggable?: boolean;
      isResizable?: boolean;
      aspectRatio?: boolean;
      parentLimitation?: boolean;
      snapToGrid?: boolean;
      gridX?: number;
      gridY?: number;
      parentW?: number;
      parentH?: number;
      w?: number;
      h?: number;
      minw?: number;
      minh?: number;
      x?: number;
      y?: number;
      z?: string;
      dragHandle?: string;
      dragCancel?: string;
      sticks?: string[];
      axis?: "x" | "y" | "both" | "none";
      contentClass?: string;
    },
    {},
    any
  >;
  export default component;
}

interface HTMLElement {
  cache?: {
    rect: DOMRect;
    freshUntil: number;
  };
}
