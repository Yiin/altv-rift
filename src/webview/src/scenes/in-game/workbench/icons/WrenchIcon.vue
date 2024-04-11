<script setup lang="ts">
defineProps<{
  active: boolean;
}>();
</script>

<template>
  <svg
    viewBox="0 0 46 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g :filter="active ? 'url(#filter0_d_735_149)' : ''">
      <path
        d="M30.768 29.6314L29.6321 30.7674C29.4822 30.9164 29.2794 31 29.0681 31C28.8567 31 28.654 30.9164 28.5041 30.7674L19.0005 21.2798C18.7403 21.3551 18.4713 21.3955 18.2005 21.3997C17.6912 21.3994 17.1893 21.2774 16.7366 21.0441C16.2838 20.8107 15.8934 20.4726 15.5976 20.0579C15.3019 19.6432 15.1094 19.1639 15.0362 18.6599C14.9629 18.1558 15.0111 17.6416 15.1766 17.1599L17.2085 19.1918L17.6325 18.7679L18.7685 17.6319L19.1925 17.2079L17.1605 15.176C17.6422 15.0105 18.1565 14.9623 18.6605 15.0355C19.1646 15.1087 19.6439 15.3012 20.0585 15.597C20.4732 15.8927 20.8113 16.2832 21.0447 16.7359C21.2781 17.1886 21.4 17.6905 21.4004 18.1999C21.3961 18.4707 21.3557 18.7397 21.2804 18.9998L30.768 28.5035C30.917 28.6533 31.0006 28.8561 31.0006 29.0674C31.0006 29.2788 30.917 29.4815 30.768 29.6314ZM15.2326 28.5035C15.0836 28.6533 15 28.8561 15 29.0674C15 29.2788 15.0836 29.4815 15.2326 29.6314L16.3686 30.7674C16.5185 30.9164 16.7212 31 16.9326 31C17.1439 31 17.3467 30.9164 17.4965 30.7674L21.8724 26.3995L19.6085 24.1356M29.4001 15L26.2002 16.5999V18.1999L24.4643 19.9358L26.0642 21.5357L27.8001 19.7998H29.4001L31 16.5999L29.4001 15Z"
        :fill="active ? '#EE2E24' : '#5D5D5D'"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_735_149"
        x="0"
        y="0"
        width="46"
        height="46"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood
          flood-opacity="0"
          result="BackgroundImageFix"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="7.5" />
        <feComposite
          in2="hardAlpha"
          operator="out"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.933333 0 0 0 0 0.180392 0 0 0 0 0.141176 0 0 0 0.7 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_735_149"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_735_149"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</template>
