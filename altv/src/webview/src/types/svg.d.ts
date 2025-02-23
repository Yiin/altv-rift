declare module "*.svg?component" {
  import { FunctionalComponent, SVGAttributes } from "vue";
  const component: FunctionalComponent<SVGAttributes>;
  export default component;
}

declare module "*.svg" {
  const content: string;
  export default content;
}
