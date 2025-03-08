import alt from "@altv/client";
import game from "@altv/natives";
import "./qa";
import "./v1";
import { everyTickWhile } from "@/core/user-interface/event-helpers";

alt.Font.register("/client/core/rmlui/fonts/jost/Jost-Regular.ttf");
alt.Font.register("/client/core/rmlui/fonts/inter/Inter-Regular.ttf");

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

  // @ts-expect-error
  if (object.streamSyncedMeta.entityType !== "savedPoint") {
    return;
  }

  const description = (object.streamSyncedMeta.description as string) ?? `Point ${object.id}`;

  const label = alt.TextLabel.create({
    fontName: "Inter",
    fontSize: 32.0,
    pos: object.pos,
    text: description,
    color: new alt.RGBA(255, 255, 255, 255),
    useStreaming: true,
    streamingDistance: 50,
    outlineWidth: 1.0,
    outlineColor: new alt.RGBA(0, 0, 0, 255),
  });

  if (!label) {
    console.log(`Failed to create label for saved point ${object.id}`);
    return;
  }

  label.faceCamera = true;

  console.log(`Saved point ${object.id} streamed in with label ${label.id}`);

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
