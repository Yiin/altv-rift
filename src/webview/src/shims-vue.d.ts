// declare module "*.vue" {
//   import { DefineComponent } from "vue";
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }

declare module "vuetify/lib/util/colors" {
  interface Color {
    base: string;
    lighten5: string;
    lighten4: string;
    lighten3: string;
    lighten2: string;
    lighten1: string;
    darken1: string;
    darken2: string;
    darken3: string;
    darken4: string;
  }

  interface Shades {
    black: string;
    white: string;
    transparent: string;
  }

  const colors: {
    red: Color;
    pink: Color;
    purple: Color;
    deepPurple: Color;
    indigo: Color;
    blue: Color;
    lightBlue: Color;
    cyan: Color;
    teal: Color;
    green: Color;
    lightGreen: Color;
    lime: Color;
    yellow: Color;
    amber: Color;
    orange: Color;
    deepOrange: Color;
    brown: Color;
    blueGrey: Color;
    grey: Color;
    shades: Shades;
  };
  export default colors;
}

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
