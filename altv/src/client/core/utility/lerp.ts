import alt from "@altv/client";
import game from "@altv/natives";
import { distance, vectorLerp } from "@shared/utility/vector";
import { ClientEvents } from "@shared/events/client";
import { loadModel } from "./model";
import { sleep } from "./sleep";

const LerpObject = {
  /**
   * Lerp an object with an ID from one point to another.
   */
  async lerp(id: alt.LocalObject, to: alt.IVector3, speed = 0.1) {
    let runTimer = 0;
    let dist = 0;
    game.freezeEntityPosition(id, true);

    return new Promise((resolve) => {
      const objectInterval = alt.Timers.setInterval(() => {
        const pos = game.getEntityCoords(id, false);
        dist = distance(pos, to);

        const objectSpeed = (1.0 / dist) * 0.01 * speed;
        runTimer += objectSpeed;

        const posTick = vectorLerp(pos, to, runTimer, false);
        game.setEntityCoords(id, posTick.x, posTick.y, posTick.z, false, false, false, false);

        if (dist <= 0.05) {
          objectInterval.destroy();
          resolve(true);
        }
      }, 1);
    });
  },

  /**
   * Create and move a temporary object.
   */
  async tempLerp(model: string, start: alt.IVector3, end: alt.IVector3, speed: number) {
    const hash = alt.hash(model);
    await loadModel(hash);

    const object = alt.LocalObject.create({
      model: hash,
      pos: new alt.Vector3(start),
      rot: alt.Vector3.zero,
      dynamic: false,
      noOffset: true,
      useStreaming: false,
    });

    await sleep(50);

    game.freezeEntityPosition(object, true);
    game.setEntityNoCollisionEntity(object, alt.Player.local, false);

    await LerpObject.lerp(object, end, speed);

    game.deleteObject(object.scriptID);
  },
};

alt.Events.onServer(ClientEvents.FromServer.PLAYER_EMIT_TEMP_OBJECT_LERP, LerpObject.tempLerp);
