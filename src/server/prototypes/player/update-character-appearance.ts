import { Player } from "alt-server";
import { type Appearance } from "@prisma/client";
import { Events } from "@shared/constants/events";

Player.prototype.updateCharacterAppearance = function (appearance: Appearance) {
  const isFemale = !appearance.sex;

  if (isFemale) {
    this.model = "mp_f_freemode_01";
  } else {
    this.model = "mp_m_freemode_01";
  }

  this.setProp(3, 15, 0);
  this.setProp(4, isFemale ? 15 : 61, isFemale ? 3 : 0);
  this.setProp(6, isFemale ? 35 : 34, 0);
  this.setProp(8, 15, 0);
  this.setProp(11, isFemale ? 5 : 15, 0);

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

  // Facial Features
  for (let i = 0; i < appearance.structure.length; i++) {
    this.setFaceFeature(i, appearance.structure[i]!);
  }

  // Overlay Features - NO COLORS
  for (const overlay of appearance.opacityOverlays) {
    this.setHeadOverlay(
      overlay.id,
      overlay.value,
      parseFloat(overlay.opacity.toString())
    );
  }

  // Hair - Tattoo
  const decorationsToSync = [];
  if (appearance.hairOverlay) {
    decorationsToSync.push(appearance.hairOverlay);
  }

  if (decorationsToSync.length >= 1) {
    this.emit(Events.Client.SET_PLAYER_DECORATIONS, decorationsToSync);
  }

  // Hair - Supports DLC
  if (typeof appearance.hairDlc === "undefined" || appearance.hairDlc === 0) {
    this.setClothes(2, appearance.hair, 0, 0);
  } else {
    this.setDlcClothes(appearance.hairDlc, 2, appearance.hair, 0, 0);
  }

  this.setHairColor(appearance.hairColor1);
  this.setHairHighlightColor(appearance.hairColor2);

  // Facial Hair
  this.setHeadOverlay(1, appearance.facialHair, appearance.facialHairOpacity);
  this.setHeadOverlayColor(
    1,
    1,
    appearance.facialHairColor1,
    appearance.facialHairColor1
  );

  // Chest Hair
  if (appearance.chestHair !== null && appearance.chestHair !== undefined) {
    this.setHeadOverlay(10, appearance.chestHair, appearance.chestHairOpacity);
    this.setHeadOverlayColor(
      10,
      1,
      appearance.chestHairColor1,
      appearance.chestHairColor1
    );
  }

  // Eyebrows
  this.setHeadOverlay(2, appearance.eyebrows, appearance.eyebrowsOpacity);
  this.setHeadOverlayColor(
    2,
    1,
    appearance.eyebrowsColor1,
    appearance.eyebrowsColor1
  );

  // Decor
  for (const overlay of appearance.colorOverlays) {
    const color2 = overlay.color2 ? overlay.color2 : overlay.color1;

    this.setHeadOverlay(
      overlay.id,
      overlay.value,
      parseFloat(overlay.opacity.toString())
    );
    this.setHeadOverlayColor(overlay.id, 1, overlay.color1, color2);
  }

  // Eyes
  this.setEyeColor(appearance.eyes);
};
