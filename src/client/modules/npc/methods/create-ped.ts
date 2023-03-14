import alt, { loadModel } from "alt-client";
import native from "natives";
import { PedType } from "@shared/modules/npc/types";
import { tick, everyTickWhile, intervalWhile } from "@/utility/event-helpers";
import { getGroundPos } from "@/utility/getGroundPos";
import { StreamedNpc } from "../ped";

export async function createLocalPed(
  this: StreamedNpc,
  modelNameOrHash: string | number
) {
  const modelHash =
    typeof modelNameOrHash === "string"
      ? alt.hash(modelNameOrHash)
      : modelNameOrHash;
  await loadModel(modelHash);

  const groundPosition = await getGroundPos(this.npc.position);

  this.ped = native.createPed(
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
    native.deletePed(this.ped);
    native.deleteEntity(this.ped);
  });

  await tick();

  native.setEntityAsMissionEntity(this.ped, true, false); // make sure its not despawned by game engine
  native.stopPedSpeaking(this.ped, true);
  native.setEntityAsMissionEntity(this.ped, true, true);
  native.taskSetBlockingOfNonTemporaryEvents(this.ped, true);
  native.setBlockingOfNonTemporaryEvents(this.ped, true);
  this.lastPedHealth = native.getEntityHealth(this.ped);
  this.lastFireTick = 0;

  switch (this.npc.type) {
    case PedType.STATIC:
      this.setupStaticPed();
      break;
    case PedType.MISSION:
      this.setupMissionPed();
      break;
  }
  await this.syncWithServer({ force: true });

  this.ready = true;
  intervalWhile(() => this.isStreamedIn, this.syncWithServer.bind(this), 1000);
  everyTickWhile(() => this.isStreamedIn, this.renderNametag.bind(this));
}
