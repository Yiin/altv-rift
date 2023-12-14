import { ReadonlyMap } from "@shared/utility/readonly-map";

export enum OverlayType {
  Blemishes = 0,
  FacialHair = 1,
  Eyebrows = 2,
  Age = 3,
  Makeup = 4,
  Blush = 5,
  Complexion = 6,
  SunDamage = 7,
  Lipstick = 8,
  Freckles = 9,
  ChestHair = 10,
  BodyBlemish = 11,
}

export const headOverlays = new ReadonlyMap([
  [
    OverlayType.Blemishes,
    {
      id: 0,
      label: "Blemishes",
      min: 0,
      max: 23,
      increment: 1,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
    },
  ],
  [
    OverlayType.FacialHair,
    {
      id: 1,
      label: "Facial Hair",
      min: 0,
      max: 28,
      increment: 1,
      colorType: 1,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
      color1: {
        min: 0,
        max: 78,
        increment: 1,
      },
      color2: {
        min: 0,
        max: 78,
        increment: 1,
      },
    },
  ],
  [
    OverlayType.Eyebrows,
    {
      id: 2,
      label: "Eyebrows",
      min: 0,
      max: 33,
      increment: 1,
      colorType: 1,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
      color1: {
        min: 0,
        max: 63,
        increment: 1,
      },
      color2: {
        min: 0,
        max: 63,
        increment: 1,
      },
    },
  ],
  [
    OverlayType.Age,
    {
      id: 3,
      label: "Age",
      min: 0,
      max: 14,
      increment: 1,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
    },
  ],
  [
    OverlayType.Makeup,
    {
      id: 4,
      label: "Makeup",
      min: 0,
      max: 74,
      increment: 1,
      colorType: 2,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
      color1: {
        min: 0,
        max: 63,
        increment: 1,
      },
      color2: {
        min: 0,
        max: 63,
        increment: 1,
      },
    },
  ],
  [
    OverlayType.Blush,
    {
      id: 5,
      label: "Blush",
      min: 0,
      max: 6,
      increment: 1,
      colorType: 2,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
      color1: {
        min: 0,
        max: 63,
        increment: 1,
      },
    },
  ],
  [
    OverlayType.Complexion,
    {
      id: 6,
      label: "Complexion",
      min: 0,
      max: 11,
      increment: 1,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
    },
  ],
  [
    OverlayType.SunDamage,
    {
      id: 7,
      label: "Sun Damage",
      min: 0,
      max: 10,
      increment: 1,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
    },
  ],
  [
    OverlayType.Lipstick,
    {
      id: 8,
      label: "Lipstick",
      min: 0,
      max: 9,
      increment: 1,
      colorType: 2,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
      color1: {
        min: 0,
        max: 63,
        increment: 1,
      },
      color2: {
        min: 0,
        max: 63,
        increment: 1,
      },
    },
  ],
  [
    OverlayType.Freckles,
    {
      id: 9,
      label: "Freckles",
      min: 0,
      max: 17,
      increment: 1,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
    },
  ],
  [
    OverlayType.ChestHair,
    {
      id: 10,
      label: "Chest Hair",
      min: 0,
      max: 16,
      increment: 1,
      colorType: 1,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
      color1: {
        min: 0,
        max: 78,
        increment: 1,
      },
    },
  ],
  [
    OverlayType.BodyBlemish,
    {
      id: 11,
      label: "Body Blemish",
      min: 0,
      max: 11,
      increment: 1,
      opacity: {
        min: 0,
        max: 1,
        increment: 0.1,
      },
    },
  ],
] as const);

export function isValidOverlay(overlay: number, type: OverlayType) {
  const overlayData = headOverlays.get(type);

  if (!overlayData) {
    return false;
  }

  return overlay >= overlayData.min && overlay <= overlayData.max;
}

export function isValidOverlayColor(overlayColor: number, type: OverlayType) {
  const overlayData = headOverlays.get(type);

  if (!overlayData) {
    return false;
  }

  if (!overlayData.colorType) {
    return false;
  }

  if (overlayData.color1) {
    return overlayColor >= overlayData.color1.min && overlayColor <= overlayData.color1.max;
  }

  return true;
}

export function isValidOverlayOpacity(overlayOpacity: number, type: OverlayType) {
  const overlayData = headOverlays.get(type);

  if (!overlayData) {
    return false;
  }

  return overlayOpacity >= overlayData.opacity.min && overlayOpacity <= overlayData.opacity.max;
}
