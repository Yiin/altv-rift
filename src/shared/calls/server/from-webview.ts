import { Appearance, ScreenPosition } from "@prisma/client/edge";
import { z } from "zod";
import { EquipmentSlot, InteractionInventoryItemSource, InteractionInventorySource, ItemSource, PlayerInventoryItemSource } from "../../interfaces";
import { schema } from "../validation";

export const FromWebview = {
  CREATE_CHARACTER: "CREATE_CHARACTER",
  MOVE_WINDOW: "MOVE_WINDOW",
  MOVE_ITEM: "MOVE_ITEM",
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM",
  UNEQUIP_ITEM: "UNEQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
  COMBINE_ITEMS: "COMBINE_ITEMS",
  UNLOAD_AMMO: "UNLOAD_AMMO",
  REMOVE_BAIT: "REMOVE_BAIT",
  BUY_ITEM: "BUY_ITEM",
  SELL_ITEM: "SELL_ITEM",
} as const;

export interface CallFromWebview<
  P extends import("@altv/server").Player = import("@altv/server").Player
> {
  [FromWebview.CREATE_CHARACTER]: (
    player: import("@altv/server").Player,
    data: {
      name: string;
      appearance: Appearance;
    }
  ) => boolean;
  [FromWebview.MOVE_WINDOW]: (
    player: import("@altv/server").Player,
    name: string,
    screen: ScreenPosition
  ) => void;
  [FromWebview.MOVE_ITEM]: (
    player: import("@altv/server").Player,
    from: ItemSource,
    toSlot: ItemSource,
    amount?: number
  ) => boolean;
  [FromWebview.USE_ITEM]: (player: P, source: ItemSource) => boolean;
  [FromWebview.EQUIP_ITEM]: (player: P, source: ItemSource) => boolean;
  [FromWebview.UNEQUIP_ITEM]: (player: P, equipmentSlot: EquipmentSlot) => boolean;
  [FromWebview.DROP_ITEM]: (player: P, source: ItemSource, amount: number) => boolean;
  [FromWebview.COMBINE_ITEMS]: (player: P, sourceA: ItemSource, sourceB: ItemSource) => boolean;
  [FromWebview.UNLOAD_AMMO]: (player: P, source: ItemSource) => boolean;
  [FromWebview.REMOVE_BAIT]: (player: P, source: ItemSource) => boolean;
  [FromWebview.BUY_ITEM]: (player: P, source: InteractionInventoryItemSource, amount: number) => boolean;
  [FromWebview.SELL_ITEM]: (player: P, shopSource: InteractionInventorySource, itemSource: PlayerInventoryItemSource, amount: number) => boolean;
}

export const FromWebviewValidation = {
  [FromWebview.CREATE_CHARACTER]: {
    args: [z.object({ name: z.string().min(1, "Required"), appearance: schema.appearance })],
    returns: z.boolean(),
  },
  [FromWebview.MOVE_WINDOW]: {
    args: [z.string(), z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() })],
  },
  [FromWebview.MOVE_ITEM]: {
    args: [schema.itemSource, schema.itemSource, z.number().optional().default(() => 1)],
    returns: z.boolean(),
  },
  [FromWebview.USE_ITEM]: {
    args: [schema.itemSource],
    returns: z.boolean(),
  },
  [FromWebview.EQUIP_ITEM]: {
    args: [schema.itemSource],
    returns: z.boolean(),
  },
  [FromWebview.UNEQUIP_ITEM]: {
    args: [schema.equipmentSlot],
    returns: z.boolean(),
  },
  [FromWebview.DROP_ITEM]: {
    args: [schema.itemSource, z.number()],
    returns: z.boolean(),
  },
  [FromWebview.COMBINE_ITEMS]: {
    args: [schema.itemSource, schema.itemSource],
    returns: z.boolean(),
  },
  [FromWebview.UNLOAD_AMMO]: {
    args: [schema.itemSource],
    returns: z.boolean(),
  },
  [FromWebview.REMOVE_BAIT]: {
    args: [schema.itemSource],
    returns: z.boolean(),
  },
  [FromWebview.BUY_ITEM]: {
    args: [schema.interactionInventoryItemSource, z.number()],
    returns: z.boolean(),
  },
  [FromWebview.SELL_ITEM]: {
    args: [schema.interactionInventorySource, schema.playerInventoryItemSource, z.number()],
    returns: z.boolean(),
  },
} satisfies Record<keyof typeof FromWebview, { args?: [z.ZodTypeAny, ...z.ZodTypeAny[]], returns?: z.ZodTypeAny }>;
