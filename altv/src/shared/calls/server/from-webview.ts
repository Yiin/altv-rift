import { Appearance, ScreenPosition } from "@prisma/client/edge";
import { z } from "zod";
import { BlueprintKey } from "@shared/modules/production";
import {
  EquipmentSlot,
  StorageItemSource,
  StorageSource,
  ItemSource,
  PlayerInventoryItemSource,
  PlayerItemSource,
} from "../../interfaces";
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
  TAKE_ITEM: "TAKE_ITEM",
  TAKE_ALL_ITEMS: "TAKE_ALL_ITEMS",
  CRAFT_ITEM: "CRAFT_ITEM",
  CANCEL_CRAFTING: "CANCEL_CRAFTING",
  REMOVE_FROM_CRAFTING_QUEUE: "REMOVE_FROM_CRAFTING_QUEUE",
  UPGRADE_ITEM: "UPGRADE_ITEM",
  CANCEL_UPGRADING: "CANCEL_UPGRADING",
  ADMIN_ACTION: "ADMIN_ACTION",
} as const;

export interface CallFromWebview {
  [FromWebview.CREATE_CHARACTER]: (data: { name: string; appearance: Appearance }) => boolean;
  [FromWebview.MOVE_WINDOW]: (name: string, screen: ScreenPosition) => void;
  [FromWebview.MOVE_ITEM]: (from: ItemSource, toSlot: ItemSource, amount?: number) => boolean;
  [FromWebview.USE_ITEM]: (source: ItemSource) => boolean;
  [FromWebview.EQUIP_ITEM]: (source: ItemSource) => boolean;
  [FromWebview.UNEQUIP_ITEM]: (equipmentSlot: EquipmentSlot) => boolean;
  [FromWebview.DROP_ITEM]: (source: ItemSource, amount: number) => boolean;
  [FromWebview.COMBINE_ITEMS]: (sourceA: ItemSource, sourceB: ItemSource) => boolean;
  [FromWebview.UNLOAD_AMMO]: (source: ItemSource) => boolean;
  [FromWebview.REMOVE_BAIT]: (source: ItemSource) => boolean;
  [FromWebview.BUY_ITEM]: (source: StorageItemSource, amount: number) => boolean;
  [FromWebview.SELL_ITEM]: (
    shopSource: StorageSource,
    itemSource: PlayerInventoryItemSource,
    amount: number,
  ) => boolean;
  [FromWebview.TAKE_ITEM]: (source: StorageItemSource) => void;
  [FromWebview.TAKE_ALL_ITEMS]: (source: StorageSource) => void;
  [FromWebview.CRAFT_ITEM]: (recipeKey: string, amount: number) => boolean;
  [FromWebview.CANCEL_CRAFTING]: () => boolean;
  [FromWebview.REMOVE_FROM_CRAFTING_QUEUE]: (index: number) => boolean;
  [FromWebview.UPGRADE_ITEM]: (itemSource: PlayerItemSource) => boolean;
  [FromWebview.CANCEL_UPGRADING]: () => boolean;
  [FromWebview.ADMIN_ACTION]: (action: string, args: any) => any;
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
    args: [
      schema.itemSource,
      schema.itemSource,
      z
        .number()
        .optional()
        .default(() => 1),
    ],
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
    args: [schema.storageItemSource, z.number()],
    returns: z.boolean(),
  },
  [FromWebview.SELL_ITEM]: {
    args: [schema.storageSource, schema.playerInventoryItemSource, z.number()],
    returns: z.boolean(),
  },
  [FromWebview.TAKE_ITEM]: {
    args: [schema.storageItemSource],
  },
  [FromWebview.TAKE_ALL_ITEMS]: {
    args: [schema.storageSource],
  },
  [FromWebview.CRAFT_ITEM]: {
    args: [z.string(), z.number()],
    returns: z.boolean(),
  },
  [FromWebview.CANCEL_CRAFTING]: {
    returns: z.boolean(),
  },
  [FromWebview.REMOVE_FROM_CRAFTING_QUEUE]: {
    args: [z.number()],
    returns: z.boolean(),
  },
  [FromWebview.UPGRADE_ITEM]: {
    args: [schema.playerItemSource],
    returns: z.boolean(),
  },
  [FromWebview.CANCEL_UPGRADING]: {
    returns: z.boolean(),
  },
  [FromWebview.ADMIN_ACTION]: {
    args: [z.string(), z.any()],
    returns: z.any(),
  },
} satisfies Record<
  keyof typeof FromWebview,
  { args?: [z.ZodTypeAny, ...z.ZodTypeAny[]]; returns?: z.ZodTypeAny }
>;
