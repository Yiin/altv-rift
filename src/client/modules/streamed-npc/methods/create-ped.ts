import alt, { loadModel } from "alt-client";
import game from "natives";
import { PedType } from "@shared/modules/streamed-npc/types";
import { tick, intervalWhile } from "@/utility/event-helpers";
import { getGroundPos } from "@/utility/get-ground-pos";
import { StreamedNpc } from "../ped";

declare module "../ped" {
  interface StreamedNpc {
    createLocalPed: typeof createLocalPed;
  }
}

async function createLocalPed(
  this: StreamedNpc,
  modelNameOrHash: string | number
) {
  const modelHash =
    typeof modelNameOrHash === "string"
      ? alt.hash(modelNameOrHash)
      : modelNameOrHash;
  await loadModel(modelHash);

  const groundPosition = await getGroundPos(this.npc.position);

  this.ped = game.createPed(
    2,
    modelHash,
    groundPosition.x,
    groundPosition.y,
    groundPosition.z,
    this.npc.heading,
    false,
    false
  );

  alt.once("disconnect", () => {
    game.deletePed(this.ped);
    game.deleteEntity(this.ped);
  });

  await tick();

  game.setEntityAsMissionEntity(this.ped, true, false); // make sure its not despawned by game engine
  game.stopPedSpeaking(this.ped, true);
  game.setEntityAsMissionEntity(this.ped, true, true);
  game.taskSetBlockingOfNonTemporaryEvents(this.ped, true);
  game.setBlockingOfNonTemporaryEvents(this.ped, true);
  this.lastPedHealth = game.getEntityHealth(this.ped);
  this.lastFireTick = 0;

  switch (this.npc.type) {
    case PedType.STATIC:
      this.setupStaticPed();
      break;
    case PedType.DYNAMIC:
      this.setupMissionPed();
      break;
  }
  await this.syncWithServer({ force: true });

  this.ready = true;
  intervalWhile(() => this.isStreamedIn, this.syncWithServer.bind(this), 1000);
}

StreamedNpc.prototype.createLocalPed = createLocalPed;
