import alt from "alt-server";
import { type Appearance } from "@prisma/client";
import { ClientEvents } from "@shared/events/client";
import { Gloves, Pants, Shoes, Top, getItemInfoByKey } from "@shared/modules/items";
import { getTorsoForTop } from "@shared/modules/items/registry/clothing/get-correct-torso";
import { getDefaultClothing } from "@shared/modules/items/registry/clothing/clothing-defaults";

declare module "alt-server" {
  export interface Player {
    resetClothes(this: Player, component?: number): void;
    updateCharacterAppearance(this: Player, appearance?: import("@prisma/client").Appearance): void;
  }
}

alt.Player.prototype.resetClothes = function (component?: number) {
  if (typeof component === "undefined") {
    for (let i = 0; i < 12; i++) {
      this.resetClothes(i);
    }
    return;
  }
  if (this.model === alt.hash("mp_f_freemode_01")) {
    switch (component) {
      case 3: {
        // gloves
        const top = this.getClothes(11);

        const torso = getTorsoForTop(this.model, top.drawable, top.texture);

        if (torso) {
          this.setClothes(3, torso.drawableId, torso.textureId);
        } else {
          const defaults = getDefaultClothing(false, component);
          if (defaults) {
            this.setClothes(component, defaults[0], defaults[1]);
          }
        }
        break;
      }
      default: {
        const defaults = getDefaultClothing(false, component);
        if (defaults) {
          this.setClothes(component, defaults[0], defaults[1]);

          if (component === 11) {
            this.resetClothes(3);
          }
        }
      }
    }
  } else {
    switch (component) {
      case 3: {
        // gloves
        const top = this.getClothes(11);

        try {
          const torso = getTorsoForTop(this.model, top.drawable, top.texture);

          if (torso) {
            this.setClothes(3, torso.drawableId, torso.textureId);
          }
        } catch {
          const defaults = getDefaultClothing(true, component);
          if (defaults) {
            this.setClothes(component, defaults[0], defaults[1]);
          }
        }
        break;
      }
      default:
        const defaults = getDefaultClothing(true, component);
        if (defaults) {
          this.setClothes(component, defaults[0], defaults[1]);

          if (component === 11) {
            this.resetClothes(3);
          }
        }
    }
  }
};

alt.Player.prototype.updateCharacterAppearance = function (appearance: Appearance) {
  const isFemale = appearance.sex;

  if (isFemale) {
    this.model = "mp_f_freemode_01";
  } else {
    this.model = "mp_m_freemode_01";
  }

  this.resetClothes();

  // Set Face
  this.clearBloodDamage();
  this.setHeadBlendData(
    appearance.faceMother,
    appearance.faceFather,
    0,
    appearance.skinMother,
    appearance.skinFather,
    0,
    parseFloat(appearance.faceMix.toString()),
    parseFloat(appearance.skinMix.toString()),
    0
  );

  // // Facial Features
  for (let i = 0; i < appearance.features.length; i++) {
    this.setFaceFeature(i, appearance.features[i]!);
  }

  for (const [id, overlay] of Object.entries(appearance.headOverlays)) {
    this.setHeadOverlay(+id, overlay.value, overlay.opacity ?? 0);

    if (typeof overlay.color1 !== "undefined" && overlay.color1 !== null) {
      this.setHeadOverlayColor(
        +id,
        [1, 2, 10].includes(+id) ? 1 : [5, 8].includes(+id) ? 2 : 0,
        overlay.color1!,
        overlay.color2 ?? overlay.color1!
      );
    }
  }

  // Hair - Tattoo
  const decorationsToSync: { collection: number; overlay: number }[] = [];
  if (appearance.hair) {
    decorationsToSync.push({
      collection: alt.hash(appearance.hairCollection),
      overlay: alt.hash(appearance.hairOverlay),
    });
  }

  if (decorationsToSync.length >= 1) {
    this.emit(ClientEvents.FromServer.SET_PLAYER_DECORATIONS, decorationsToSync);
  }

  // Hair
  if (typeof appearance.hairDlc === "undefined" || appearance.hairDlc === 0) {
    this.setClothes(2, appearance.hair, 0, 0);
  } else {
    this.setDlcClothes(appearance.hairDlc, 2, appearance.hair, 0, 0);
  }

  this.setHairColor(appearance.hairColor1);
  this.setHairHighlightColor(appearance.hairColor2);

  // Eyes
  this.setEyeColor(appearance.eyes);
};
