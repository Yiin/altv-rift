// build/plugins/fileloc-plugin.js
declare var __relativedirname: string;
declare var __relativefilename: string;
declare var __line: number;

declare module "core-js-pure/actual/structured-clone" {
  export default function structuredClone<T>(value: T): T;
}

declare module "*.yaml" {
  const content: any;
  export default content;
}
