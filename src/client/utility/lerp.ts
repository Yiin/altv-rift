import alt from "alt-client";
import native from "natives";
import { distance, vectorLerp } from "@shared/utility/vector";
import { Events } from "@shared/constants/events";
import { loadModel } from "./model";
import { sleep } from "./sleep";

const LerpObject = {
  /**
   * Lerp an object with an ID from one point to another.
   */
  async lerp(id: number, to: alt.IVector3, speed = 0.1) {
    let runTimer = 0;
    let dist = 0;
    native.freezeEntityPosition(id, true);

    return new Promise((resolve) => {
      const objectInterval = alt.setInterval(() => {
        const pos = native.getEntityCoords(id, false);
        dist = distance(pos, to);

        const objectSpeed = (1.0 / dist) * 0.01 * speed;
        runTimer += objectSpeed;

        const posTick = vectorLerp(pos, to, runTimer, false);
        native.setEntityCoords(
          id,
          posTick.x,
          posTick.y,
          posTick.z,
          false,
          false,
          false,
          false
        );

        if (dist <= 0.05) {
          alt.clearInterval(objectInterval);
          resolve(true);
        }
      }, 1);
    });
  },

  /**
   * Create and move a temporary object.
   */
  async tempLerp(
    model: string,
    start: alt.IVector3,
    end: alt.IVector3,
    speed: number
  ) {
    const hash = alt.hash(model);
    await loadModel(hash);

    const object = native.createObjectNoOffset(
      hash,
      start.x,
      start.y,
      start.z,
      false,
      false,
      false
    );

    await sleep(50);

    native.freezeEntityPosition(object, true);
    native.setEntityNoCollisionEntity(object, alt.Player.local.scriptID, false);

    await LerpObject.lerp(object, end, speed);

    native.deleteObject(object);
  },
};

alt.onServer(Events.Client.PLAYER_EMIT_TEMP_OBJECT_LERP, LerpObject.tempLerp);
