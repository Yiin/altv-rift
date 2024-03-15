<script setup lang="ts">
import { type WeaponModuleType } from "./types";

const props = defineProps({
  weaponModules: Array<WeaponModuleType>,
});
</script>

<template>
  <div class="absolute h-full max-w-sm">
    <div
      class="rifles relative flex h-[calc(100vh_-_128px)] w-full snap-y snap-mandatory flex-col gap-2.5 overflow-y-auto pl-3"
      dir="rtl"
    >
      <div
        v-for="weaponModule in props.weaponModules"
        :key="weaponModule.name"
        class="w-full snap-start rounded-md px-6 pb-6 pt-7"
        :class="weaponModule.isActive ? 'bg-weaponCardA' : 'bg-weaponCard'"
        dir="ltr"
      >
        <h2 class="text-xl font-bold text-white">{{ weaponModule.name }}</h2>
        <p class="text-sm text-[#B1B1B1]">{{ weaponModule.shortDesc }}</p>
        <div>
          <img
            :src="weaponModule.image"
            :alt="weaponModule.name"
            class="w-full"
          />
        </div>
        <div class="-mt-6 flex justify-end">
          <button
            class="flex h-10 w-10 items-center justify-center rounded-[4px] border border-solid border-primaryGreen p-2 text-primaryGreen"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.797 12.8025L12.803 13.7965C12.6719 13.9268 12.4945 14 12.3096 14C12.1246 14 11.9472 13.9268 11.8161 13.7965L3.50042 5.49478C3.27279 5.56073 3.0374 5.59603 2.80044 5.59978C2.35477 5.59946 1.91562 5.49276 1.51949 5.28854C1.12336 5.08433 0.781699 4.78851 0.522918 4.42566C0.264136 4.06282 0.0957085 3.64345 0.0316382 3.20241C-0.0324322 2.76137 0.00970582 2.3114 0.154549 1.88992L1.93248 3.66785L2.30346 3.29687L3.29742 2.30291L3.66841 1.93192L1.89048 0.153994C2.31196 0.00915092 2.76192 -0.0329871 3.20296 0.0310833C3.644 0.0951536 4.06338 0.263581 4.42622 0.522363C4.78906 0.781144 5.08489 1.1228 5.2891 1.51893C5.49331 1.91506 5.60001 2.35422 5.60033 2.79989C5.59659 3.03684 5.56128 3.27224 5.49534 3.49986L13.797 11.8155C13.9274 11.9467 14.0006 12.1241 14.0006 12.309C14.0006 12.4939 13.9274 12.6713 13.797 12.8025ZM0.203547 11.8155C0.0731763 11.9467 0 12.1241 0 12.309C0 12.4939 0.0731763 12.6713 0.203547 12.8025L1.19751 13.7965C1.32866 13.9268 1.50607 14 1.69099 14C1.87591 14 2.05332 13.9268 2.18447 13.7965L6.01332 9.9746L4.03239 7.99368M12.6001 0L9.80017 1.39994V2.79989L8.28123 4.31883L9.68117 5.71877L11.2001 4.19983H12.6001L14 1.39994L12.6001 0Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
