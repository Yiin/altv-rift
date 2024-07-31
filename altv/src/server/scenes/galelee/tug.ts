import alt from "@altv/server";

const tug = alt.Vehicle.create({
  model: "tug",
  pos: {
    x: 1321.5782470703125,
    y: 4221.90966796875,
    z: 31.143442153930664
  },
  rot: {
    x: 0.04504868760704994,
    y: -0.027388054877519608,
    z: 1.3684065341949463
  },
});

tug.engineHealth = 0;
tug.streamSyncedMeta.invincible = true;
tug.boatAnchorActive = true;
