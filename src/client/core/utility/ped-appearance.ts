import alt from "alt-client";
import game from "natives";
import { Appearance } from "@prisma/client";
import { ClothingComponent } from "@shared/interfaces/clothing";
import { Pants, Shoes, Top, getItemInfoByKey } from "@shared/modules/items";
import { getDefaultClothing } from "@shared/modules/items/registry/clothing/clothing-defaults";

export const PedAppearance = {
  /**
   * Apply Appearance Data to a Ped.
   */
  applyAppearance(ped: number, appearance: Appearance) {
    if (!ped || !game.doesEntityExist(ped)) {
      return;
    }

    game.clearPedBloodDamage(ped);
    game.clearPedDecorations(ped);

    game.setPedHeadBlendData(ped, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
    game.setPedHeadBlendData(
      ped,
      appearance.faceMother,
      appearance.faceFather,
      0,
      appearance.skinMother,
      appearance.skinFather,
      0,
      parseFloat(appearance.faceMix.toString()),
      parseFloat(appearance.skinMix.toString()),
      0,
      false
    );

    // Facial Features
    for (let i = 0; i < appearance.features.length; i++) {
      const value = appearance.features[i]!;

      game.setPedMicroMorph(ped, i, value);
    }

    // Head Overlays
    for (const [id, overlay] of Object.entries(appearance.headOverlays)) {
      game.setPedHeadOverlay(ped, +id, overlay.value, overlay.opacity ?? 1);

      if (typeof overlay.color1 !== "undefined" && overlay.color1 !== null) {
        game.setPedHeadOverlayTint(
          ped,
          +id,
          [1, 2, 10].includes(+id) ? 1 : [5, 8].includes(+id) ? 2 : 0,
          overlay.color1,
          overlay.color2 ?? overlay.color1
        );
      }
    }

    // Hair - Tattoo
    if (appearance.hair) {
      try {
        const collection = alt.hash(appearance.hairCollection);
        const overlay = alt.hash(appearance.hairOverlay);
        game.addPedDecorationFromHashes(ped, collection, overlay);
      } catch {
        alt.log(`Error adding ped decoration. Hair: `, appearance.hair);
      }
    }

    // Hair
    if (typeof appearance.hairDlc === "undefined" || appearance.hairDlc === 0) {
      game.setPedComponentVariation(ped, 2, appearance.hair, 0, 0);
    } else {
      alt.setPedDlcClothes(ped, appearance.hairDlc, 2, appearance.hair, 0, 0);
    }

    game.setPedHairTint(ped, appearance.hairColor1, appearance.hairColor2);

    // Eyes
    game.setHeadBlendEyeColor(ped, appearance.eyes);
    game.clearAllPedProps(ped, false);
  },

  /**
   * Should only use this to apply clothing to a custom ped.
   * Do not use it for anything else.
   */
  applyEquipment(ped: number, components?: ClothingComponent[], isMale = true) {
    if (!ped || !game.doesEntityExist(ped)) {
      return;
    }

    // Clothing
    for (let i = 2; i < 12; i++) {
      const defaults = getDefaultClothing(isMale, i);
      if (!defaults) {
        continue;
      }

      alt.setPedDlcClothes(ped, 0, i, defaults[0], defaults[1]);
    }

    if (!components || !Array.isArray(components)) {
      return;
    }

    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      if (!component) {
        continue;
      }

      for (let index = 0; index < component.drawables.length; index++) {
        const id = component.ids[index]!;
        const drawable = component.drawables[index]!;
        const texture = component.textures[index]!;

        if (component.dlcHashes && component.dlcHashes.length >= 1) {
          let dlc = component.dlcHashes[index]!;
          if (typeof dlc === "string") {
            dlc = alt.hash(dlc);
          }

          if (component.isProp) {
            if (drawable <= -1) {
              game.clearPedProp(ped, id, false);
              continue;
            }

            alt.setPedDlcProp(ped, dlc, id, drawable, texture);
            continue;
          }

          alt.setPedDlcClothes(ped, dlc, id, drawable, texture, 0);
          continue;
        }

        if (component.isProp) {
          if (drawable <= -1) {
            game.clearPedProp(ped, id, false);
            continue;
          }

          game.setPedPropIndex(ped, id, drawable, texture, true, false);
        } else {
          game.setPedComponentVariation(ped, id, drawable, texture, 0);
        }
      }
    }
  },

  applyHairOverlay(decorations: Array<{ collection: string; overlay: string }>) {
    game.clearPedDecorations(alt.Player.local);

    for (let i = 0; i < decorations.length; i++) {
      const collection = alt.hash(decorations[i]!.collection);
      const overlay = alt.hash(decorations[i]!.overlay);
      game.addPedDecorationFromHashes(alt.Player.local, collection, overlay);
    }
  },
};
