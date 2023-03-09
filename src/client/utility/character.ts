import alt from "alt-client";
import native from "natives";
import { Appearance } from "@prisma/client";
import { ClothingComponent } from "@shared/interfaces/clothing";

export const Character = {
  /**
   * Apply Appearance Data to a Ped.
   */
  applyAppearance(ped: number, appearance: Appearance) {
    alt.log("applyAppearance", JSON.stringify(appearance, null, 2));

    if (!ped || !native.doesEntityExist(ped)) {
      return;
    }

    native.clearPedBloodDamage(ped);
    native.clearPedDecorations(ped);

    native.setPedHeadBlendData(ped, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
    native.setPedHeadBlendData(
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

      native.setPedMicroMorph(ped, i, value);
    }

    // Head Overlays
    for (const [id, overlay] of Object.entries(appearance.headOverlays)) {
      alt.log(`Overlay: `, id, JSON.stringify(overlay));
      native.setPedHeadOverlay(ped, +id, overlay.value, overlay.opacity ?? 1);

      if (typeof overlay.color1 !== "undefined" && overlay.color1 !== null) {
        native.setPedHeadOverlayTint(
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
        native.addPedDecorationFromHashes(ped, collection, overlay);
      } catch {
        alt.log(`Error adding ped decoration. Hair: `, appearance.hair);
      }
    }

    // Hair
    if (typeof appearance.hairDlc === "undefined" || appearance.hairDlc === 0) {
      native.setPedComponentVariation(ped, 2, appearance.hair, 0, 0);
    } else {
      alt.setPedDlcClothes(ped, appearance.hairDlc, 2, appearance.hair, 0, 0);
    }

    native.setPedHairTint(ped, appearance.hairColor1, appearance.hairColor2);

    // Eyes
    native.setHeadBlendEyeColor(ped, appearance.eyes);
    native.clearAllPedProps(ped);
  },

  /**
   * Should only use this to apply clothing to a custom ped.
   * Do not use it for anything else.
   */
  applyEquipment(ped: number, components?: ClothingComponent[], isMale = true) {
    if (!ped || !native.doesEntityExist(ped)) {
      return;
    }

    // native.clearAllPedProps(ped);

    if (isMale) {
      // native.setPedComponentVariation(ped, 1, 0, 0, 2); // mask
      // native.setPedComponentVariation(ped, 3, 15, 0, 2); // arms
      // native.setPedComponentVariation(ped, 4, 61, 0, 2); // pants
      // native.setPedComponentVariation(ped, 5, 0, 0, 2); // bag
      // native.setPedComponentVariation(ped, 6, 34, 0, 2); // shoes
      // native.setPedComponentVariation(ped, 7, 0, 0, 2); // accessories
      // native.setPedComponentVariation(ped, 8, 15, 0, 2); // undershirt
      // native.setPedComponentVariation(ped, 9, 0, 0, 2); // body armour
      // native.setPedComponentVariation(ped, 11, 15, 0, 2); // torso
    } else {
      // native.setPedComponentVariation(ped, 1, 0, 0, 2); // mask
      native.setPedComponentVariation(ped, 3, 11, 0, 0); // arms
      // native.setPedComponentVariation(ped, 4, 14, 0, 2); // pants
      // native.setPedComponentVariation(ped, 5, 0, 0, 2); // bag
      native.setPedComponentVariation(ped, 6, 4, 0, 0); // shoes
      // native.setPedComponentVariation(ped, 7, 0, 0, 2); // accessories
      // native.setPedComponentVariation(ped, 8, 15, 0, 2); // undershirt
      // native.setPedComponentVariation(ped, 9, 0, 0, 2); // body armour
      native.setPedComponentVariation(ped, 11, 2, 0, 0); // torso
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
              native.clearPedProp(ped, id);
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
            native.clearPedProp(ped, id);
            continue;
          }

          native.setPedPropIndex(ped, id, drawable, texture, true);
        } else {
          native.setPedComponentVariation(ped, id, drawable, texture, 0);
        }
      }
    }
  },

  applyHairOverlay(
    decorations: Array<{ collection: string; overlay: string }>
  ) {
    native.clearPedDecorations(alt.Player.local.scriptID);

    for (let i = 0; i < decorations.length; i++) {
      const collection = alt.hash(decorations[i]!.collection);
      const overlay = alt.hash(decorations[i]!.overlay);
      native.addPedDecorationFromHashes(
        alt.Player.local.scriptID,
        collection,
        overlay
      );
    }
  },
};
