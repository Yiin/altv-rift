import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { Appearance } from "@prisma/client";
import { PedAppearance } from "./ped-appearance";
import { loadModel } from "./model";

let id: number | undefined;
let appearance: Appearance | undefined;
let pos: alt.IVector3;
let rot: alt.IVector3 | number;
let isUpdating: boolean = false;
let hidden: boolean = false;

/**
 * Used to create a single instance of a character pedestrian.
 * Mostly used for appearance editing and such.
 * Do not use it for anything else.
 */
export const CharacterPed = {
  /**
   * Create a Temporary Character Pedestrian
   */
  async create(
    isMale: boolean,
    _pos: alt.IVector3,
    _rot: alt.IVector3 | number = { x: 0, y: 0, z: 0 }
  ): Promise<number> {
    pos = _pos;
    rot = _rot;
    hidden = false;

    await CharacterPed.destroy();

    const model = isMale ? "mp_m_freemode_01" : "mp_f_freemode_01";
    const hash = alt.hash(model);
    await loadModel(hash);
    id = game.createPed(2, hash, _pos.x, _pos.y, _pos.z, 0, false, false);

    return new Promise(async (resolve: Function) => {
      alt.Timers.nextTick(async () => {
        if (id === undefined || id < 0) {
          return resolve(-1);
        }
        game.stopPedSpeaking(id, true);
        game.setEntityAsMissionEntity(id, true, true);
        game.taskSetBlockingOfNonTemporaryEvents(id, true);
        game.setBlockingOfNonTemporaryEvents(id, true);
        // game.freezeEntityPosition(id, true);
        game.setEntityInvincible(id, true);
        game.setPedCanRagdoll(id, false);

        if (typeof _rot === "object") {
          game.setEntityRotation(id, _rot.x, _rot.y, _rot.z, 1, false);
        } else {
          game.setEntityHeading(id, _rot);
        }
        await PedAppearance.applyEquipment(CharacterPed.get(), [], isMale);
        return resolve(id);
      });
    });
  },

  /**
   * Apply pedestrian appearance data.
   */
  async apply(newAppearance: Appearance): Promise<void> {
    if (id === undefined || id < 0) {
      return;
    }

    if (isUpdating) {
      return;
    }

    isUpdating = true;

    if (!appearance || (appearance && appearance.sex !== newAppearance.sex)) {
      await CharacterPed.destroy();
      await CharacterPed.create(newAppearance.sex === 0, pos, rot);
    }

    await PedAppearance.applyAppearance(id, newAppearance);

    await CharacterPed.setHidden(false);

    appearance = newAppearance;
    isUpdating = false;
  },

  getApperance() {
    return appearance;
  },

  /**
   * Get the pedestrian id.
   */
  get(): number {
    if (id === undefined || id < 0) {
      return -1;
    }

    return id;
  },

  /**
   * Hide this pedestrian
   */
  setHidden(value: boolean) {
    hidden = value;

    if (hidden && id && game.doesEntityExist(id)) {
      game.setEntityVisible(id, false, false);
    }

    if (!hidden && id && game.doesEntityExist(id)) {
      game.setEntityVisible(id, true, false);
    }
  },

  /**
   * Destroy the pedestrian character.
   * Does not clear previous position or rotation.
   */
  async destroy() {
    if (id) {
      game.deletePed(id);
      game.deleteEntity(id);
    }

    return new Promise((resolve: Function) => {
      let attempts = 0;
      const interval = alt.Timers.setInterval(() => {
        if (id === undefined || id < 0) {
          interval.destroy();
          return resolve();
        }

        if (!game.doesEntityExist(id)) {
          id = undefined;
          interval.destroy();
          return resolve();
        }

        if (attempts >= 10) {
          id = undefined;
          interval.destroy();
          return resolve();
        }

        game.deletePed(id);
        game.deleteEntity(id);
        attempts += 1;
      }, 100);
    });
  },
};
