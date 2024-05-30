import { $ } from "bun";

async function installDependencies() {
  await $`bun install`;
}

async function copyFiles() {
  await $`bun run build/copy.ts`;
}

async function updateAltvTypes() {
  await $`bun run upd-altv-types`;
}

async function devServer() {
  await $`bun run build/server.ts -dev`;
}

async function devClient() {
  await $`bun run build/client.ts -dev`;
}

async function tscServer() {
  await $`cd src/server && bun run tsc -w --noEmit`;
}

async function tscClient() {
  await $`cd src/client && bun run tsc -w --noEmit`;
}

async function tscAll() {
  await Promise.all([tscServer(), tscClient()]);
}

async function devAll() {
  await installDependencies();
  await copyFiles();
  await updateAltvTypes();
  await Promise.all([devServer(), devClient(), tscAll()]);
}

async function main() {
  const args = process.argv.slice(2);

  const promises = [];

  if (args.includes("--server")) {
    promises.push(devServer());
  }

  if (args.includes("--client")) {
    promises.push(devClient());
  }

  if (args.includes("--tsc:server")) {
    promises.push(tscServer());
  }

  if (args.includes("--tsc:client")) {
    promises.push(tscClient());
  }

  if (args.includes("--tsc")) {
    promises.push(tscAll());
  }

  if (args.length === 0 || args.includes("--all")) {
    promises.push(devAll());
  }

  await Promise.all(promises);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
