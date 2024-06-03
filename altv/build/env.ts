export function isDev() {
  return process.argv[2] === "-dev";
}
