<script setup lang="ts">
import { useVehshop } from "@/store/vehshop.store";
import Icon from "@/components/Icon/Icon.vue";
import Donut from "@/components/Donut.vue";
import DarkBackground from "@/components/DarkBackground.vue";
import BackButtons from "@/components/buttons/BackButtons.vue";
import { asset } from "@/utils/asset";

const vehshop = useVehshop();

const selectCarType = (carType: any) => {
  vehshop.selectCarType(carType);
};

const selectCar = (car: any) => {
  vehshop.selectCar(car);
};
</script>

<template>
  <div class="relative flex h-full w-full flex-col justify-between px-20 py-11">
    <DarkBackground />
    <div class="mx-auto flex w-full items-center justify-between">
      <div class="w-40"><v-img :src="asset(`assets/vehicles/logo.webp`)" /></div>
      <div
        class="no-scrollbar mx-20 flex gap-2.5 overflow-x-auto whitespace-nowrap text-base font-bold uppercase text-white"
      >
        <button
          v-for="item in vehshop.carTypes"
          :key="item"
          @click="selectCarType(item)"
          class="rounded-md border border-solid border-white/30 px-11 py-3 uppercase"
          :class="{
            'bg-sunriseYellow text-black shadow-sunriseYellow': item === vehshop.selectedCarType,
            'transition duration-200 hover:bg-white/10': item !== vehshop.selectedCarType,
          }"
        >
          {{ item }}
        </button>
      </div>
      <BackButtons />
    </div>
    <div class="flex items-center justify-between">
      <div class="flex w-52 flex-col gap-5">
        <div class="text-5xl font-extrabold text-white">
          {{ vehshop.selectedCarInfo.modelMain }}
        </div>
        <div>
          <div class="text-2xl text-white/50">PRICE</div>
          <div class="text-4xl font-extrabold text-sunriseYellow">
            {{ vehshop.selectedCarInfo.price }}
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button
            class="rounded-md border-1 border-solid border-sunriseYellow bg-sunriseYellow py-3 text-sm font-bold uppercase text-black transition duration-200 hover:bg-sunriseYellow/80"
          >
            Buy car
          </button>
          <button
            class="border border-solid border-white/10 py-3 text-sm font-bold uppercase text-white transition duration-200 hover:bg-white/10"
          >
            Test drive
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <Donut
          :percent="(vehshop.selectedCarInfo.maxSpeed * 100) / 500"
          label="maxSpeed"
          :value="`${vehshop.selectedCarInfo.maxSpeed} km/h`"
        />
        <Donut
          :percent="vehshop.selectedCarInfo.acceleration"
          label="acceleration"
          :value="`${vehshop.selectedCarInfo.acceleration} %`"
        />
        <Donut
          :percent="vehshop.selectedCarInfo.breaking"
          label="breaking"
          :value="`${vehshop.selectedCarInfo.breaking} %`"
        />
        <Donut
          :percent="(vehshop.selectedCarInfo.weight * 100) / 10000"
          label="weight"
          :value="`${vehshop.selectedCarInfo.weight} kg`"
        />
      </div>
    </div>
    <div class="flex w-full gap-1 overflow-x-scroll">
      <div
        v-for="item in vehshop.carInfo"
        :key="item"
        @click="selectCar(item)"
        class="flex cursor-pointer flex-col justify-end"
      >
        <div class="flex h-1 w-80 bg-sunriseYellow"></div>
        <div
          class="duration-400 flex w-80 flex-col justify-between bg-black/80 px-8 py-6 transition hover:bg-sunriseYellowToBlack"
          :class="{
            'h-64 bg-sunriseYellowToBlack': item.modelSub === vehshop.selectedCarInfo.modelSub,
          }"
        >
          <div v-if="item.modelSub === vehshop.selectedCarInfo.modelSub">
            <v-img
              :src="asset(`assets/vehicles/${item.manufacturer}.webp`)"
              class="h-20"
            />
          </div>
          <div class="flex w-full justify-between">
            <div class="flex flex-col">
              <div class="text-xl font-bold text-white">{{ item.modelMain }}</div>
              <div class="mb-4 text-base text-sunriseYellow">{{ item.modelSub }}</div>
              <div class="text-xl font-bold text-white">{{ item.price }}</div>
            </div>
            <Icon
              :name="item.manufacturer"
              :width="64"
              :height="40"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
