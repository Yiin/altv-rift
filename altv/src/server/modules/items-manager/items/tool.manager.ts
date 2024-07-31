import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { on } from "@/core/events/emit";
import { Tool, isItemTool } from "@shared/modules/items";
import { PedBone } from "@shared/enums/bones";
import { degreesToRadians } from "@shared/utility/units";
import { EquipmentSlot } from "@shared/interfaces";

const TOOL_OBJECT_MAP = {
  [Tool.FISHING_ROD]: {
    model: "prop_fishing_rod_01",
    attach: {
      bone: PedBone.SKEL_R_Hand,
      pos: new alt.Vector3(0.1, -0.05, -0.03),
      rot: new alt.Vector3(
        degreesToRadians(81),
        degreesToRadians(-18),
        degreesToRadians(184)
      )
      // bone: PedBone.IK_L_Hand,
      // pos: new alt.Vector3(0.03, 0.02, 0.03),
      // rot: new alt.Vector3(
      //   degreesToRadians(288),
      //   degreesToRadians(267),
      //   degreesToRadians(298)
      // )
    }
  },
  [Tool.PICKAXE]: {
    weapon: alt.hash("WEAPON_PICKAXE"),
    attach: {
      bone: PedBone.SKEL_R_Hand,
      pos: new alt.Vector3(0.1, -0.05, -0.03),
      rot: new alt.Vector3(
        degreesToRadians(81),
        degreesToRadians(-18),
        degreesToRadians(184)
      )
    }
  },
  [Tool.HATCHET]: {
    weapon: alt.hash("WEAPON_HATCHET"),
    attach: {
      bone: PedBone.SKEL_R_Hand,
      pos: new alt.Vector3(0.1, -0.05, -0.03),
      rot: new alt.Vector3(
        degreesToRadians(-10),
        degreesToRadians(-18),
        degreesToRadians(184)
      )
      // bone: PedBone.IK_R_Hand,
      // pos: new alt.Vector3(-0.03, -0.01, -0.06),
      // rot: new alt.Vector3(
      //   degreesToRadians(0),
      //   degreesToRadians(60),
      //   degreesToRadians(29)
      // )
    }
  },
  [Tool.SHOVEL]: {
    model: "prop_tool_shovel",
    attach: {
      bone: PedBone.PH_R_Hand,
      pos: new alt.Vector3(0, 0, 0.24),
      rot: new alt.Vector3(0, 0, 0)
    }
  },
}

on(ServerEvents.FromServer.ITEM_EQUIP, (player, item) => {
  if (!isItemTool(item)) {
    return;
  }

  if (item.key in TOOL_OBJECT_MAP === false) {
    return;
  }

  const { model, weapon, attach } = TOOL_OBJECT_MAP[item.key];

  if (model && player.objectInHand && player.objectInHand === alt.hash(model)) {
    // Tool object is already in hand
    return;
  }

  if (player.objectInHand) {
    // Destroy old object
    const obj = alt.Object.getByID(player.objectInHand);
    obj?.destroy();
  }

  if (model) {
    const toolObj = alt.Object.create({
      model,
      pos: player.pos,
      rot: alt.Vector3.zero
    });

    player.objectInHand = toolObj.id;

    toolObj.attachTo(
      player,
      attach.bone,
      0,
      attach.pos,
      attach.rot,
      false,
      false
    );
  } else if (weapon) {
    player.giveWeapon(weapon, 1, true);
  }
});

on(ServerEvents.FromServer.ITEM_UNEQUIP, (player, equipmentSlot, item) => {
  if (equipmentSlot !== EquipmentSlot.Weapon) {
    return;
  }

  if (!isItemTool(item)) {
    return;
  }

  const { model, weapon } = TOOL_OBJECT_MAP[item.key];

  if (model) {
    if (!player.objectInHand) {
      return;
    }

    const toolObj = alt.Object.getByID(player.objectInHand);
    if (!toolObj) {
      return;
    }

    const toolModels = Object.values(TOOL_OBJECT_MAP).filter(({ model }) => model).map(obj => alt.hash(obj.model!));

    if (!toolModels.includes(toolObj.model)) {
      // not a tool
      return;
    }

    delete player.objectInHand;
    toolObj.destroy();
  } else if (weapon) {
    player.removeWeapon(weapon);
  }
});

alt.Events.onPlayerDisconnect(({ player }) => {
  if (player.objectInHand) {
    const obj = alt.Object.getByID(player.objectInHand);
    if (obj) {
      obj.destroy();
    }
  }
});
