import alt from "@altv/client";
import game from "@altv/natives";
import "./qa";
import "./v1";
import { everyTickWhile } from "@/core/user-interface/event-helpers";

function loadAsset(asset: string) {
  return new Promise((resolve) => {
    game.requestNamedPtfxAsset(asset);
    everyTickWhile(
      () => !game.hasNamedPtfxAssetLoaded(asset),
      () => {
        game.requestNamedPtfxAsset(asset);
      },
      () => {
        resolve(true);
      },
    );
  });
}

let interval: alt.Timers.EveryTick;

async function startParticleLoop(asset: string, particle: string) {
  if (interval) {
    interval.destroy();
  }

  await loadAsset(asset);

  // Create an interval that runs every frame to spawn the particle
  interval = alt.Timers.everyTick(() => {
    game.useParticleFxAsset(asset);

    const pos = alt.Player.local.pos;

    // Start the non-looped particle effect at player position
    game.startParticleFxNonLoopedAtCoord(
      particle,
      pos.x,
      pos.y,
      pos.z,
      0.0,
      0.0,
      0.0,
      1.0,
      false,
      false,
      false,
    );
  }); // 0ms interval to run every frame
}

alt.Events.onConsoleCommand(({ command, args: [asset, particle] }) => {
  if (command === "particle") {
    startParticleLoop(asset, particle);
  }
});

alt.Events.onWorldObjectStreamIn(({ object }) => {
  if (!(object instanceof alt.VirtualEntity)) {
    return;
  }

  if (object.meta.entityType !== "savedPoint") {
    return;
  }

  const description = (object.meta.description as string) ?? `Point ${object.id}`;

  const label = alt.TextLabel.create({
    fontName: "Arial",
    fontSize: 1.0,
    pos: object.pos,
    text: description,
    color: new alt.RGBA(255, 255, 255, 255),
    streamingDistance: 50,
  });

  // @ts-expect-error
  object.label = label;
});

alt.Events.onWorldObjectStreamOut(({ object }) => {
  if (!(object instanceof alt.VirtualEntity)) {
    return;
  }

  // @ts-expect-error
  object.label?.destroy();
});
