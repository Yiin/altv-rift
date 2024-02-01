import { z } from "zod";
import { EquipmentSlot, ItemSourceOrigin } from "@shared/interfaces";
import { OverlayType } from "@shared/modules/character/appearance-data";

export const appearance = z.object({
  sex: z.number(),
  faceFather: z.number(),
  faceMother: z.number(),
  skinFather: z.number(),
  skinMother: z.number(),
  faceMix: z.number(),
  skinMix: z.number(),
  features: z.array(z.number()),
  hair: z.number(),
  hairCollection: z.string(),
  hairOverlay: z.string(),
  hairDlc: z.number(),
  hairColor1: z.number(),
  hairColor2: z.number(),
  eyes: z.number(),
  headOverlays: z.array(
    z.union([
      z.object({
        id: z.literal(OverlayType.Blemishes),
        value: z.number().min(0).max(23),
        opacity: z.number().min(0).max(1),
      }),
      z.object({
        id: z.literal(OverlayType.FacialHair),
        value: z.number().min(0).max(28),
        opacity: z.number().min(0).max(1),
        color1: z.number().min(0).max(78).step(1),
        color2: z.number().min(0).max(78).step(1),
      }),
      z.object({
        id: z.literal(OverlayType.Eyebrows),
        value: z.number().min(0).max(33),
        opacity: z.number().min(0).max(1),
        color1: z.number().min(0).max(63).step(1),
        color2: z.number().min(0).max(63).step(1),
      }),
      z.object({
        id: z.literal(OverlayType.Age),
        value: z.number().min(0).max(14),
        opacity: z.number().min(0).max(1),
      }),
      z.object({
        id: z.literal(OverlayType.Makeup),
        value: z.number().min(0).max(74),
        opacity: z.number().min(0).max(1),
        color1: z.number().min(0).max(63).step(1),
        color2: z.number().min(0).max(63).step(1),
      }),
      z.object({
        id: z.literal(OverlayType.Blush),
        value: z.number().min(0).max(6),
        opacity: z.number().min(0).max(1),
        color1: z.number().min(0).max(63).step(1),
      }),
      z.object({
        id: z.literal(OverlayType.Complexion),
        value: z.number().min(0).max(11),
        opacity: z.number().min(0).max(1),
      }),
      z.object({
        id: z.literal(OverlayType.SunDamage),
        value: z.number().min(0).max(10),
        opacity: z.number().min(0).max(1),
      }),
      z.object({
        id: z.literal(OverlayType.Lipstick),
        value: z.number().min(0).max(9),
        opacity: z.number().min(0).max(1),
        color1: z.number().min(0).max(63).step(1),
        color2: z.number().min(0).max(63).step(1),
      }),
      z.object({
        id: z.literal(OverlayType.Freckles),
        value: z.number().min(0).max(17),
        opacity: z.number().min(0).max(1),
      }),
      z.object({
        id: z.literal(OverlayType.ChestHair),
        value: z.number().min(0).max(16),
        opacity: z.number().min(0).max(1),
        color1: z.number().min(0).max(78).step(1),
      }),
      z.object({
        id: z.literal(OverlayType.BodyBlemish),
        value: z.number().min(0).max(11),
        opacity: z.number().min(0).max(1),
      }),
    ])
  ),
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
    origin: z.literal(ItemSourceOrigin.InteractionInventory),
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
export const interactionInventorySource = z.object({
  origin: z.literal(ItemSourceOrigin.InteractionInventory),
  originId: z.number(),
});
export const playerInventoryItemSource = playerInventorySource.extend({
  inventorySlot: z.number(),
});
export const playerEquipmentItemSource = PlayerEquipmentSource.extend({
  equipmentSlot: equipmentSlot,
});
export const interactionInventoryItemSource = interactionInventorySource.extend({
  inventorySlot: z.number(),
});
export const groundItemSource = z.object({
  origin: z.literal(ItemSourceOrigin.Ground),
  originId: z.number(),
});
