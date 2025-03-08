<script setup lang="ts">
import { reactive } from "vue";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";

const airDrop = reactive(getDefaultAirDrop());

function getDefaultAirDrop() {
  return {
    radius: 0,
    lootTable: "",
    duration: 60 * 5,
  };
}

async function addAirDrop() {
  console.log("Adding air drop", JSON.stringify(airDrop));
  const success = await rpc.callServer(ServerCall.FromWebview.ADMIN_ACTION, "addAirDrop", airDrop);

  console.log("Success", success);

  if (success) {
    Object.assign(airDrop, getDefaultAirDrop());
  }
}
</script>

<template>
  <div>
    <input
      v-model="airDrop.radius"
      type="number"
      placeholder="Radius"
    />
    <input
      v-model="airDrop.lootTable"
      type="text"
      placeholder="Loot Table"
    />
    <input
      v-model="airDrop.duration"
      type="number"
      placeholder="Duration"
    />
    <div
      @click="addAirDrop"
      class="group inline-block cursor-pointer rounded bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-hidden focus:ring-3 active:text-opacity-75"
    >
      <span
        class="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent"
      >
        Add new Air Drop
      </span>
    </div>
  </div>
</template>
