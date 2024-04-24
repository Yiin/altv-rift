<script setup lang="ts">
import { computed } from "vue";
import { ItemGrade } from "@shared/modules/items";
import DefaultBadge from "../assets/badges/none.svg";
import CommonBadge from "../assets/badges/common.svg";
import UncommonBadge from "../assets/badges/uncommon.svg";
import RareBadge from "../assets/badges/rare.svg";
import EpicBadge from "../assets/badges/epic.svg";
import LegendaryBadge from "../assets/badges/legendary.svg";
import ContrabandBadge from "../assets/badges/contraband.svg";
import LimitedBadge from "../assets/badges/limited.svg";

const props = withDefaults(
  defineProps<{
    grade?: string;
  }>(),
  {
    grade: "none",
  },
);

const stars = computed(
  () =>
    ({
      [ItemGrade.COMMON]: 1,
      [ItemGrade.UNCOMMON]: 2,
      [ItemGrade.RARE]: 3,
      [ItemGrade.EPIC]: 4,
    })[props.grade],
);
</script>

<template>
  <div>
    <div
      class="relative"
      :class="
        {
          none: `text-gray-500`,
          [ItemGrade.COMMON]: `text-common`,
          [ItemGrade.UNCOMMON]: `text-uncommon`,
          [ItemGrade.RARE]: `text-rare`,
          [ItemGrade.EPIC]: `text-epic`,
          [ItemGrade.LEGENDARY]: `text-legendary`,
          [ItemGrade.CONTRABAND]: `text-contraband`,
        }[grade]
      "
    >
      <img
        :src="
          {
            none: DefaultBadge,
            [ItemGrade.COMMON]: CommonBadge,
            [ItemGrade.UNCOMMON]: UncommonBadge,
            [ItemGrade.RARE]: RareBadge,
            [ItemGrade.EPIC]: EpicBadge,
            [ItemGrade.LEGENDARY]: LegendaryBadge,
            [ItemGrade.CONTRABAND]: ContrabandBadge,
            [ItemGrade.LIMITED]: LimitedBadge,
          }[grade]
        "
        class="align-self-center h-69.5 w-48.75"
      />
      <div
        v-if="grade !== 'none'"
        class="absolute-center-x bottom-13.25 z-max text-center text-lg font-bold uppercase drop-shadow-glow-color"
        :class="[grade === ItemGrade.LIMITED ? 'text-limited' : '']"
        :style="{
          '--glow-color': {
            [ItemGrade.COMMON]: `rgb(255 255 255 / 0.5)`,
            [ItemGrade.UNCOMMON]: `rgb(185 240 69 / 0.5)`,
            [ItemGrade.RARE]: `rgb(32 135 255 / 0.8)`,
            [ItemGrade.EPIC]: `rgb(187 44 255 / 0.8)`,
            [ItemGrade.LEGENDARY]: `rgb(255 218 87 / 0.5)`,
            [ItemGrade.CONTRABAND]: `rgb(255 218 87 / 0.5)`,
          }[grade],
        }"
      >
        {{ grade }}
      </div>
      <div class="absolute-center-x bottom-7.5 z-max flex justify-center gap-1.25">
        <template v-if="stars">
          <svg
            v-for="i in stars"
            :key="i"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 0L11.645 5.35942L17.5595 6.21885L13.2798 10.3906L14.2901 16.2812L9 13.5L3.70993 16.2812L4.72025 10.3906L0.440492 6.21885L6.35497 5.35942L9 0Z"
              fill="currentColor"
            />
          </svg>
        </template>
        <template v-else-if="grade === ItemGrade.LEGENDARY">
          <svg
            width="52"
            height="20"
            viewBox="0 0 52 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 6L9.7042 10.1684L14.6329 10.8369L11.0665 14.0816L11.9084 18.6631L7.5 16.5L3.09161 18.6631L3.93354 14.0816L0.367076 10.8369L5.2958 10.1684L7.5 6Z"
              fill="#FFDA57"
            />
            <path
              d="M26 0L28.9389 5.95492L35.5106 6.90983L30.7553 11.5451L31.8779 18.0902L26 15L20.1221 18.0902L21.2447 11.5451L16.4894 6.90983L23.0611 5.95492L26 0Z"
              fill="#FFDA57"
            />
            <path
              d="M44.5 6L46.7042 10.1684L51.6329 10.8369L48.0665 14.0816L48.9084 18.6631L44.5 16.5L40.0916 18.6631L40.9335 14.0816L37.3671 10.8369L42.2958 10.1684L44.5 6Z"
              fill="#FFDA57"
            />
          </svg>
        </template>
        <template v-else-if="grade === ItemGrade.CONTRABAND">
          <svg
            width="59"
            height="27"
            viewBox="0 0 59 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 10L8.4103 13.5729L12.6819 14.1459L9.59093 16.9271L10.3206 20.8541L6.5 19L2.6794 20.8541L3.40907 16.9271L0.318133 14.1459L4.5897 13.5729L6.5 10Z"
              fill="#EE2E24"
            />
            <path
              d="M53 10L54.7634 13.5729L58.7063 14.1459L55.8532 16.9271L56.5267 20.8541L53 19L49.4733 20.8541L50.1468 16.9271L47.2937 14.1459L51.2366 13.5729L53 10Z"
              fill="#EE2E24"
            />
            <path
              d="M23.4761 0C20.7795 1.24566 19 3.24846 19 5.4948C19 6.9733 19.7573 8.3424 21.044 9.46088C20.3858 10.8991 19.9724 12.5136 19.8697 14.2295C20.84 14.2613 21.7619 14.4676 22.5893 14.892C24.9351 16.0953 26.0365 18.6827 25.8505 21.749C26.2817 21.8533 26.7171 21.9398 27.1554 22.0083C27.2058 21.0593 27.2022 20.1132 27.1274 19.1701L28.1788 19.086C28.2599 20.1073 28.2615 21.1253 28.2046 22.1403C28.6573 22.1833 29.1154 22.2088 29.5772 22.2186V19.0342H30.6318V22.2126C31.0737 22.1985 31.5174 22.1699 31.9617 22.1269C31.9055 21.1164 31.9075 20.1028 31.9882 19.0861L33.0395 19.1702C32.9649 20.11 32.9611 21.0528 33.0111 21.9986C33.4235 21.938 33.835 21.8653 34.2449 21.781C34.0493 18.7009 35.1501 16.0996 37.5039 14.8921C38.3312 14.4676 39.2532 14.2612 40.2235 14.2295C40.1195 12.4902 39.6962 10.8549 39.0223 9.40204C40.2684 8.29444 41 6.94754 41 5.49486C41 3.24851 39.2205 1.24566 36.5239 0.000169892C37.2606 0.93829 37.7142 2.06231 37.7142 3.24919C37.7142 5.66644 35.9359 7.7574 33.3673 8.75017L33.0208 7.94042C33.6499 7.689 34.219 7.363 34.7068 6.97982C35.2768 6.53219 35.734 6.01225 36.0561 5.4422C34.3716 4.00769 32.2952 3.16114 30.0466 3.16114C27.77 3.16114 25.6699 4.02831 23.9742 5.49543C24.2944 6.0447 24.7411 6.54612 25.2932 6.97982C25.8389 7.40847 26.4865 7.76561 27.206 8.02683L26.8603 8.83454C24.1697 7.87966 22.2858 5.73733 22.2858 3.24919C22.2858 2.06231 22.7394 0.93829 23.4761 0.000169892V0ZM24.0566 10.3698C24.0597 10.3696 24.0623 10.37 24.0638 10.3719C25.103 11.6941 26.9944 12.6198 29.2042 12.816C28.8717 13.9314 27.681 14.7712 26.2318 14.7712C24.5269 14.7712 23.1195 13.6057 23.1195 12.1938C23.1196 11.488 23.4697 10.835 24.0287 10.372C24.0334 10.3773 24.0473 10.3705 24.0566 10.3697L24.0566 10.3698ZM36.002 10.3699C36.0049 10.3697 36.0076 10.3702 36.0097 10.3722C36.5688 10.8351 36.919 11.4881 36.919 12.194C36.919 13.6057 35.5117 14.7713 33.8067 14.7713C32.3574 14.7713 31.1669 13.9315 30.8343 12.816C33.044 12.6198 34.9355 11.6941 35.9747 10.372C35.981 10.3769 35.9929 10.3703 36.002 10.3699ZM30.0436 12.8701C30.3611 14.4228 30.8296 15.9755 31.9009 17.5282C30.7567 17.8358 29.3716 17.8468 28.1864 17.5282C29.2004 15.9755 29.7007 14.4228 30.0436 12.8701ZM25.7371 22.8102C25.6051 23.6823 25.3752 24.5826 25.0458 25.4927C25.5395 25.8169 26.0621 26.0943 26.6069 26.3216C26.8116 25.2329 26.9759 24.1485 27.077 23.0681C26.6272 22.9998 26.1802 22.9138 25.7371 22.8103L25.7371 22.8102ZM34.3604 22.8374C33.9388 22.9227 33.5149 22.9961 33.0892 23.0576C33.1894 24.1319 33.3519 25.2102 33.5546 26.2926C34.0749 26.0709 34.5744 25.8032 35.0474 25.4927C34.7215 24.592 34.493 23.7009 34.3604 22.8374V22.8374ZM32.0413 23.1837C31.5709 23.229 31.1006 23.2586 30.6318 23.2732V26.9931C31.2814 26.9503 31.9243 26.8361 32.5491 26.6528C32.3291 25.5009 32.1508 24.3445 32.0413 23.1837ZM28.1246 23.1971C28.0144 24.3602 27.8351 25.5189 27.6143 26.6731C28.2544 26.8552 28.9128 26.9649 29.5772 27V23.2789C29.0922 23.2696 28.6077 23.2423 28.1246 23.1971Z"
              fill="#EE2E24"
            />
          </svg>
        </template>
      </div>
    </div>
  </div>
</template>
