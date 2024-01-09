const dev = process.argv[2] === "-dev";
console.log("dev:", dev);

export const esbuildOptions = {
  bundle: true,
  format: "esm",
  target: "esnext",
  logLevel: "info",
  sourcemap: false,
  minify: false,
  keepNames: true,
};

export const altvEsbuildOptions = {
  dev: dev
    ? {
      enhancedRestartCommand: true,
    }
    : false,
  altvEnums: true,
};
