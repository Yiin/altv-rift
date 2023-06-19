declare module "core-js-pure/actual/structured-clone" {
  export default function structuredClone<T>(value: T): T;
}

declare module "*.yaml" {
  const content: any;
  export default content;
}
