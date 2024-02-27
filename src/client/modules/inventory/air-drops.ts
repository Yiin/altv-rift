import alt from "@altv/client";
import game from "@altv/natives";
import _ from "lodash";
import { AirDropType } from "@shared/modules/air-drops";
import { StorageType } from "@shared/store/game-state.store";

type AirDropData = {
  lootBox: alt.LocalObject;
  parachute?: alt.LocalObject;
  timer?: alt.Timers.EveryTick;
};

const airDrops = new Map<alt.VirtualEntity['id'], AirDropData>();

function syncAirDrop(entity: alt.VirtualEntity) {
  if (!entity.streamSyncedMeta.interpolate) {
    throw new Error(`No interpolation data for air drop ${entity.id}`);
  }

  const currentPos = interpolateAirDropPosition(entity);

  const airDrop = airDrops.get(entity.id);

  if (!airDrop) {
    // We have no air drop yet, let's create one.
    const lootBox = alt.LocalObject.create({
      model: getAirDropModel(entity.streamSyncedMeta.airDropType),
      streamingDistance: 300,
      pos: currentPos,
      rot: alt.Vector3.zero,
    });

    game.freezeEntityPosition(lootBox.scriptID, true);

    if (!isAirDropInPosition(entity)) {
      // Airdrop is still in the air, attach a parachute to it.
      const parachute = alt.LocalObject.create({
        model: "p_parachute1_s",
        streamingDistance: 300,
        pos: currentPos,
        rot: alt.Vector3.zero,
      });

      parachute.attachTo(lootBox, 0, new alt.Vector3(0, 0, 3.3), alt.Vector3.zero, false, false, false);

      const timer = alt.Timers.everyTick(() => {
        const airDrop = airDrops.get(entity.id)!;

        if (isAirDropInPosition(entity)) {
          timer.destroy();
          parachute.destroy();

          if (airDrop) {
            delete airDrop.parachute;
            delete airDrop.timer;
          }
        }

        const newPos = interpolateAirDropPosition(entity);
        game.setEntityCoordsNoOffset(lootBox.scriptID, newPos.x, newPos.y, newPos.z, true, true, true);
      });

      airDrops.set(entity.id, { parachute, lootBox, timer });
    } else {
      // Air drop is already in position, just place it on the ground.
      airDrops.set(entity.id, { lootBox });
    }
  } else {
    // Air drop already exists, update the position if needed
    if (airDrop.parachute) {
      if (isAirDropInPosition(entity)) {
        airDrop.parachute.destroy();
        airDrop.timer?.destroy();
        delete airDrop.parachute;
        delete airDrop.timer;
      } else {
        game.setEntityCoordsNoOffset(airDrop.lootBox.scriptID, currentPos.x, currentPos.y, currentPos.z, true, true, true);
      }
    }
  }
}

function getDropPosition(entity: alt.VirtualEntity) {
  return entity.pos.sub(0, 0, 0.3);
}

export function isAirDropInPosition(entity: alt.VirtualEntity) {
  const { streamSyncedMeta: { interpolate } } = entity;

  if (!interpolate) {
    throw new Error(`No interpolation data for air drop ${entity.id}`);
  }

  const to = getDropPosition(entity);

  const { ts, from, speed } = interpolate;

  return (alt.getNetTime() - ts) / 1000 >= from.distanceTo(to) / speed;
}

function interpolateAirDropPosition(entity: alt.VirtualEntity) {
  const { streamSyncedMeta: { interpolate } } = entity;

  if (!interpolate) {
    throw new Error(`No interpolation data for air drop ${entity.id}`);
  }

  const { ts, from, speed } = interpolate;

  const to = getDropPosition(entity);
  const elapsed = (alt.getNetTime() - ts) / 1000;
  const distance = from.distanceTo(to);
  return from.lerp(Math.min(speed * elapsed / distance, 1), to);
}

function getAirDropModel(type: AirDropType) {
  switch (type) {
    case AirDropType.MixWeapons:
      return "ba_prop_battle_crates_wpn_mix_01a";
    case AirDropType.MixWeaponsLarge:
      return "h4_prop_h4_crates_full_01a";
    case AirDropType.HandgunWeapons:
      return "ba_prop_battle_crates_pistols_01a";
    case AirDropType.FirearmWeapons:
      return _.sample([
        "ba_prop_battle_crates_rifles_01a",
        "ba_prop_battle_crates_rifles_04a",
        "ba_prop_battle_crates_rifles_03a",
      ]);
    case AirDropType.HeavyWeapons:
      return "ba_prop_battle_crates_sam_01a";
    case AirDropType.WeaponComponents:
      return "ba_prop_batle_crates_mule";
  }
  return "vw_prop_vw_crate_01a";
}

alt.Events.onStreamSyncedMetaChange(({ entity, key, newValue }) => {
  if (
    !(entity instanceof alt.VirtualEntity)
    || entity.streamSyncedMeta.entityType !== "storage"
    || entity.streamSyncedMeta.storageType !== StorageType.LootBox
    || key !== "interpolate"
  ) {
    return;
  }

  if (newValue) {
    return;
  }

  syncAirDrop(entity);
});

alt.Events.onWorldObjectStreamIn(({ object }) => {
  if (
    !(object instanceof alt.VirtualEntity)
    || object.streamSyncedMeta.entityType !== "storage"
    || object.streamSyncedMeta.storageType !== StorageType.AirDrop
  ) {
    return;
  }

  if (!object.streamSyncedMeta.interpolate) {
    return;
  }

  const existingAirDrop = airDrops.get(object.id);

  if (existingAirDrop) {
    throw new Error(`Air drop already exists for airdrop ${object.id}`);
  }

  syncAirDrop(object);
});

alt.Events.onWorldObjectStreamOut(({ object }) => {
  if (
    !(object instanceof alt.VirtualEntity)
    || object.streamSyncedMeta.entityType !== "storage"
    || object.streamSyncedMeta.storageType !== StorageType.LootBox
  ) {
    return;
  }

  const airDrop = airDrops.get(object.id);

  if (!airDrop) {
    return;
  }

  airDrop.parachute?.destroy();
  airDrop.lootBox.destroy();
  airDrops.delete(object.id);
});
