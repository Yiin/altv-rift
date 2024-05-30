<script setup lang="ts">
defineProps<{ imageUrl: string; id: number }>();
</script>

<template>
  <div class="relative h-37.5 w-65 bg-stone-900">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 260 150"
      fill="none"
    >
      <mask
        :id="`mask0_1419_117_${id}`"
        style="mask-type: alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="260"
        height="150"
      >
        <rect
          width="260"
          height="150"
          fill="white"
        />
      </mask>
      <g :mask="`url(#mask0_1419_117_${id})`">
        <g
          opacity="0.4"
          :filter="`url(#filter0_f_1419_117_${id})`"
        >
          <rect
            x="63"
            y="19"
            width="129"
            height="106"
            :fill="`url(#pattern0_1419_117_${id})`"
            filter="url(#invertDarkToLight)"
          />
        </g>
      </g>
      <defs>
        <filter
          :id="`filter0_f_1419_117_${id}`"
          x="3"
          y="-41"
          width="249"
          height="226"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood
            flood-opacity="0"
            result="BackgroundImageFix"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="22"
            result="effect1_foregroundBlur_1419_117"
          />
        </filter>
        <filter
          id="invertDarkToLight"
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          <!-- Step 1: Extract luminance -->
          <feColorMatrix
            type="matrix"
            values="0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0      0      0      100 0.1"
            result="luminance"
          />
          <!-- Step 2: Invert luminance -->
          <feComponentTransfer
            in="luminance"
            result="invertedLuminance"
          >
            <feFuncR
              type="table"
              tableValues="1 0"
            />
            <feFuncG
              type="table"
              tableValues="1 0"
            />
            <feFuncB
              type="table"
              tableValues="1 0"
            />
          </feComponentTransfer>
          <!-- Step 3: Blend original colors with inverted luminance where needed -->
          <feBlend
            mode="multiply"
            in2="invertedLuminance"
            in="SourceGraphic"
            result="conditionalInvert"
          />
          <!-- Step 4: Merge results -->
          <feMerge>
            <feMergeNode in="conditionalInvert" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern
          :id="`pattern0_1419_117_${id}`"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            :xlink:href="`#image0_1419_117_${id}`"
            transform="matrix(0.00209644 0 0 0.00259067 -0.159329 -0.282383)"
          />
        </pattern>
        <image
          :id="`image0_1419_117_${id}`"
          width="600"
          height="600"
          :xlink:href="imageUrl"
        />
      </defs>
    </svg>

    <div
      class="absolute-center z-10 h-23 w-23 bg-contain bg-center"
      :style="{ backgroundImage: `url(${imageUrl})` }"
    />
  </div>
</template>
