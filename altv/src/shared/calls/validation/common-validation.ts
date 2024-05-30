import { z } from "zod";
import { EquipmentSlot, ItemSourceOrigin } from "@shared/interfaces";
import {
  MAX_EYE_COLOR,
  MAX_HAIR_COLOR,
  OverlayType,
  featureNames,
  isValidHair,
  parents,
} from "@shared/modules/character/appearance-data";

export const appearance = z
  .object({
    sex: z.union([z.literal(0), z.literal(1)]),
    faceFather: z
      .number()
      .min(0)
      .max(parents.length - 1)
      .step(1),
    faceMother: z
      .number()
      .min(0)
      .max(parents.length - 1)
      .step(1),
    skinFather: z
      .number()
      .min(0)
      .max(parents.length - 1)
      .step(1),
    skinMother: z
      .number()
      .min(0)
      .max(parents.length - 1)
      .step(1),
    faceMix: z.number().min(0).max(1),
    skinMix: z.number().min(0).max(1),
    features: z.array(z.number().min(-1).max(1)).length(featureNames.length),
    hair: z.number(), // Validated in the refine, below
    hairCollection: z.string(), // same
    hairOverlay: z.string(), // same
    hairDlc: z.literal(0),
    hairColor1: z
      .number()
      .min(0)
      .max(MAX_HAIR_COLOR - 1)
      .step(1),
    hairColor2: z
      .number()
      .min(0)
      .max(MAX_HAIR_COLOR - 1)
      .step(1),
    eyes: z
      .number()
      .min(0)
      .max(MAX_EYE_COLOR - 1)
      .step(1),
    headOverlays: z.array(
      z.union([
        z.object({
          id: z.literal(OverlayType.Blemishes),
          value: z.number().min(0).max(23).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
        }),
        z.object({
          id: z.literal(OverlayType.FacialHair),
          value: z.number().min(0).max(28).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
          color1: z.number().min(0).max(78).step(1),
          color2: z.number().min(0).max(78).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.Eyebrows),
          value: z.number().min(0).max(33).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
          color1: z.number().min(0).max(63).step(1),
          color2: z.number().min(0).max(63).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.Age),
          value: z.number().min(0).max(14).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
        }),
        z.object({
          id: z.literal(OverlayType.Makeup),
          value: z.number().min(0).max(74).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
          color1: z.number().min(0).max(63).step(1),
          color2: z.number().min(0).max(63).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.Blush),
          value: z.number().min(0).max(6).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
          color1: z.number().min(0).max(63).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.Complexion),
          value: z.number().min(0).max(11).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
        }),
        z.object({
          id: z.literal(OverlayType.SunDamage),
          value: z.number().min(0).max(10).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
        }),
        z.object({
          id: z.literal(OverlayType.Lipstick),
          value: z.number().min(0).max(9).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
          color1: z.number().min(0).max(63).step(1),
          color2: z.number().min(0).max(63).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.Freckles),
          value: z.number().min(0).max(17).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
        }),
        z.object({
          id: z.literal(OverlayType.ChestHair),
          value: z.number().min(0).max(16).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
          color1: z.number().min(0).max(78).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.BodyBlemish),
          value: z.number().min(0).max(11).or(z.literal(255)),
          opacity: z.number().min(0).max(1),
        }),
      ]),
    ),
  })
  .refine((data) => isValidHair(data.sex, data.hair, data.hairCollection, data.hairOverlay), {
    message: "Invalid hair",
  });

export const equipmentSlot = z.nativeEnum(EquipmentSlot);
export const itemSourceOrigin = z.nativeEnum(ItemSourceOrigin);
export const itemSource = z.union([
  z.object({
    origin: z.literal(ItemSourceOrigin.PlayerInventory),
    originId: z.string(),
  }),
  z.object({
    origin: z.literal(ItemSourceOrigin.PlayerEquipment),
    originId: z.string(),
  }),
  z.object({
    origin: z.literal(ItemSourceOrigin.Storage),
    originId: z.number(),
  }),
  z.object({
    origin: z.literal(ItemSourceOrigin.Ground),
    originId: z.number(),
  }),
]);
export const playerInventorySource = z.object({
  origin: z.literal(ItemSourceOrigin.PlayerInventory),
  originId: z.string(),
});
export const PlayerEquipmentSource = z.object({
  origin: z.literal(ItemSourceOrigin.PlayerEquipment),
  originId: z.string(),
});
export const storageSource = z.object({
  origin: z.literal(ItemSourceOrigin.Storage),
  originId: z.number(),
});
export const playerInventoryItemSource = playerInventorySource.extend({
  inventorySlot: z.number(),
});
export const playerEquipmentItemSource = PlayerEquipmentSource.extend({
  equipmentSlot: equipmentSlot,
});
export const playerItemSource = z.union([playerInventoryItemSource, playerEquipmentItemSource]);
export const storageItemSource = storageSource.extend({
  inventorySlot: z.number(),
});
export const groundItemSource = z.object({
  origin: z.literal(ItemSourceOrigin.Ground),
  originId: z.number(),
});
