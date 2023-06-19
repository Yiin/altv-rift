import alt from "alt-client";
import native from "natives";
import { Appearance } from "@prisma/client";
import { Character } from "./character";
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
    id = native.createPed(2, hash, _pos.x, _pos.y, _pos.z, 0, false, false);

    return new Promise(async (resolve: Function) => {
      alt.nextTick(async () => {
        if (id === undefined || id < 0) {
          return resolve(-1);
        }
        native.stopPedSpeaking(id, true);
        native.setEntityAsMissionEntity(id, true, true);
        native.taskSetBlockingOfNonTemporaryEvents(id, true);
        native.setBlockingOfNonTemporaryEvents(id, true);
        // native.freezeEntityPosition(id, true);
        native.setEntityInvincible(id, true);
        native.setPedCanRagdoll(id, false);

        if (typeof _rot === "object") {
          native.setEntityRotation(id, _rot.x, _rot.y, _rot.z, 1, false);
        } else {
          native.setEntityHeading(id, _rot);
        }
        await Character.applyEquipment(CharacterPed.get(), [], isMale);
        return resolve(id);
      });
    });
  },

  /**
   * Apply pedestrian appearance data.
   */
  async apply(_appearance: Appearance): Promise<void> {
    if (id === undefined || id < 0) {
      return;
    }

    if (isUpdating) {
      return;
    }

    isUpdating = true;

    if (!appearance || (appearance && appearance.sex !== _appearance.sex)) {
      await CharacterPed.destroy();
      await CharacterPed.create(_appearance.sex === 0, pos, rot);
    }

    await Character.applyAppearance(id, _appearance);

    await CharacterPed.setHidden(false);

    appearance = _appearance;
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

    if (hidden && id && native.doesEntityExist(id)) {
      native.setEntityVisible(id, false, false);
    }

    if (!hidden && id && native.doesEntityExist(id)) {
      native.setEntityVisible(id, true, false);
    }
  },

  /**
   * Destroy the pedestrian character.
   * Does not clear previous position or rotation.
   */
  async destroy() {
    if (id) {
      native.deletePed(id);
      native.deleteEntity(id);
    }

    return new Promise((resolve: Function) => {
      let attempts = 0;
      const interval = alt.setInterval(() => {
        if (id === undefined || id < 0) {
          alt.clearInterval(interval);
          return resolve();
        }

        if (!native.doesEntityExist(id)) {
          id = undefined;
          alt.clearInterval(interval);
          return resolve();
        }

        if (attempts >= 10) {
          id = undefined;
          alt.clearInterval(interval);
          return resolve();
        }

        native.deletePed(id);
        native.deleteEntity(id);
        attempts += 1;
      }, 100);
    });
  },
};

alt.on("disconnect", CharacterPed.destroy);
