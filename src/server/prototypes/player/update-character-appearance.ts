import alt, { Player } from "alt-server";
import { type Appearance } from "@prisma/client";
import { Events } from "@shared/constants/events";

declare module "alt-server" {
  export interface Player {
    updateCharacterAppearance(
      appearance?: import("@prisma/client").Appearance
    ): void;
  }
}

Player.prototype.updateCharacterAppearance = function (
  this: Player,
  appearance: Appearance
) {
  const isFemale = appearance.sex;

  if (isFemale) {
    this.model = "mp_f_freemode_01";
  } else {
    this.model = "mp_m_freemode_01";
  }

  if (isFemale) {
    this.setDlcClothes(0, 3, 14, 0, 0); // torso
    this.setDlcClothes(0, 4, 14, 0, 0); // pants
    this.setDlcClothes(0, 6, 1, 0, 0); // shoes
    this.setDlcClothes(0, 11, 14, 0, 0); // shoes
  } else {
    this.setDlcClothes(0, 3, 15, 0, 0); // torso / arms
    this.setDlcClothes(0, 4, 14, 0, 0); // pants
    this.setDlcClothes(0, 6, 34, 0, 0); // shoes
    this.setDlcClothes(0, 8, 15, 0, 0); // undershirt
    this.setDlcClothes(0, 11, 91, 0, 0); // tops
  }

  // this.setProp(3, 15, 0);
  // this.setProp(4, isFemale ? 15 : 61, isFemale ? 3 : 0);
  // this.setProp(6, isFemale ? 35 : 34, 0);
  // this.setProp(8, 15, 0);
  // this.setProp(11, isFemale ? 5 : 15, 0);

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
    this.emit(Events.Client.SET_PLAYER_DECORATIONS, decorationsToSync);
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
