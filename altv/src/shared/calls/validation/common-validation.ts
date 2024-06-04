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
      .gte(0)
      .lt(parents.length)
      .step(1),
    faceMother: z
      .number()
      .gte(0)
      .lt(parents.length)
      .step(1),
    skinFather: z
      .number()
      .gte(0)
      .lt(parents.length)
      .step(1),
    skinMother: z
      .number()
      .gte(0)
      .lt(parents.length)
      .step(1),
    faceMix: z.number().gte(0).lte(1),
    skinMix: z.number().gte(0).lte(1),
    features: z.array(z.number().gte(-1).lte(1)).length(featureNames.length),
    hair: z.number(), // Validated in the refine, below
    hairCollection: z.string(), // same
    hairOverlay: z.string(), // same
    hairDlc: z.literal(0),
    hairColor1: z
      .number()
      .gte(0)
      .lt(MAX_HAIR_COLOR)
      .step(1),
    hairColor2: z
      .number()
      .gte(0)
      .lt(MAX_HAIR_COLOR)
      .step(1),
    eyes: z
      .number()
      .gte(0)
      .lt(MAX_EYE_COLOR)
      .step(1),
    headOverlays: z.array(
      z.union([
        z.object({
          id: z.literal(OverlayType.Blemishes),
          value: z.number().gte(0).lte(23).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
        }),
        z.object({
          id: z.literal(OverlayType.FacialHair),
          value: z.number().gte(0).lte(28).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
          color1: z.number().gte(0).lte(78).step(1),
          color2: z.number().gte(0).lte(78).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.Eyebrows),
          value: z.number().gte(0).lte(33).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
          color1: z.number().gte(0).lte(63).step(1),
          color2: z.number().gte(0).lte(63).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.Age),
          value: z.number().gte(0).lte(14).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
        }),
        z.object({
          id: z.literal(OverlayType.Makeup),
          value: z.number().gte(0).lte(74).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
          color1: z.number().gte(0).lte(63).step(1),
          color2: z.number().gte(0).lte(63).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.Blush),
          value: z.number().gte(0).lte(6).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
          color1: z.number().gte(0).lte(63).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.Complexion),
          value: z.number().gte(0).lte(11).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
        }),
        z.object({
          id: z.literal(OverlayType.SunDamage),
          value: z.number().gte(0).lte(10).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
        }),
        z.object({
          id: z.literal(OverlayType.Lipstick),
          value: z.number().gte(0).lte(9).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
          color1: z.number().gte(0).lte(63).step(1),
          color2: z.number().gte(0).lte(63).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.Freckles),
          value: z.number().gte(0).lte(17).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
        }),
        z.object({
          id: z.literal(OverlayType.ChestHair),
          value: z.number().gte(0).lte(16).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
          color1: z.number().gte(0).lte(78).step(1),
        }),
        z.object({
          id: z.literal(OverlayType.BodyBlemish),
          value: z.number().gte(0).lte(11).or(z.literal(255)),
          opacity: z.number().gte(0).lte(1),
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
