import { $ } from "bun";
import chalk from "chalk";
import crypto from "crypto";

const USE_CACHE = process.argv[2] === "cache";
const CDN_URL = "https://cdn.alt-mp.com";

const BRANCHES = ["dev", "rc", "release"];
const PLATFORM = process.platform === "win32" ? "x64_win32" : "x64_linux";
const SERVER_IMAGE_NAME = "rift/altv-server";
const VOICE_SERVER_IMAGE_NAME = "rift/altv-voice-server";

function sha1(input) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

function generateTags(branch, version, modulesVersions) {
  const buildHash = sha1(`${branch}-${version}-${modulesVersions.join("-")}`);
  const tags = [
    branch, // dev
  ];

  if (branch === "release") {
    tags.push("latest");
  } else {
    tags.push(version.replace(/.\d+$/, "")); // 15.4-dev
  }

  return [buildHash, tags];
}

async function buildDocker(imageName, tags, branch, dockerfilePath, cacheKey) {
  const serializedTags = { raw: tags.map(tag => `-t ${imageName}:${tag}`).join(" ") };
  await $`docker build . --platform linux/amd64 --build-arg CACHEBUST=${cacheKey ?? Date.now()} --build-arg BRANCH=${branch} ${serializedTags} -f ${dockerfilePath}`;
}

async function buildBranch(branch) {
  console.log(chalk.gray("Building branch ") + chalk.white(chalk.bold(branch)));

  const modules = ["js-module", "js-module-v2"];
  if (branch === "release") {
    modules.push("js-bytecode-module");
  }

  const serverUpdateReq = await fetch(`${CDN_URL}/server/${branch}/${PLATFORM}/update.json`);
  const serverUpdate = JSON.parse(await serverUpdateReq.text());
  const version = serverUpdate.version;
  const sdkVersion = serverUpdate.sdkVersion;

  if (!sdkVersion) {
    console.log(chalk.yellow("Branch ") + chalk.bold(chalk.whiteBright(branch)) + chalk.yellow(" does not have SDK version!"));
    return;
  }

  console.log(chalk.gray("SDK version is ") + chalk.white(chalk.bold(sdkVersion)));

  // Server
  {
    const [buildHash, tags] = generateTags(branch, version, [sdkVersion]);
    console.log(chalk.gray("Building server with tags " + tags.map(e => chalk.white(chalk.bold(e))).join(", ")));
    await buildDocker(SERVER_IMAGE_NAME, tags, branch, "./server/Dockerfile", buildHash);
    console.log(chalk.green("Server on branch ") + chalk.white(chalk.bold(branch)) + chalk.green(" built successfully"));
  }

  // Voice server
  {
    const [buildHash, tags] = generateTags(branch, version, []);
    console.log(chalk.gray("Building voice server with tags " + tags.map(e => chalk.white(chalk.bold(e))).join(", ")));
    await buildDocker(VOICE_SERVER_IMAGE_NAME, tags, branch, "./voice-server/Dockerfile", buildHash);
    console.log(chalk.green("Voice server on branch ") + chalk.white(chalk.bold(branch)) + chalk.green(" built successfully"));
  }

  console.log(chalk.green("Build of branch ") + chalk.white(chalk.bold(branch)) + chalk.green(" was successful"));
}

async function run() {
  console.log(chalk.gray("Building alt:V Docker images with ") + chalk.white(chalk.bold(USE_CACHE ? "cache (images will be pushed automatically)" : "no cache")));
  for (const branch of BRANCHES) {
    await buildBranch(branch);
  }
}

run();