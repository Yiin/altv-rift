<script setup lang="ts">
import { NotificationType } from "@shared/interfaces";
import { asset } from "@/utils/asset";
import Icon from "./Icon/Icon.vue";
import type { Notification } from "../plugins/notiwind";

defineProps<{
  notification: Notification;
}>();
</script>

<template>
  <div
<<<<<<< Updated upstream
    class="text-white rounded-lg"
=======
    class="bg-black-900/100 relative max-w-80 rounded-lg text-white"
>>>>>>> Stashed changes
    role="alert"
  >
    <div
      class="flex items-center gap-4 p-4 rounded-lg"
      :class="{
<<<<<<< Updated upstream
        'bg-[#110000]/85': props.notification.type === NotificationType.Error,
        'bg-[#0B3800]/85': props.notification.type === NotificationType.Success,
        'bg-[#002857]/85': props.notification.type === NotificationType.Info,
        'bg-black/85': props.notification.type === NotificationType.Warning,
=======
        'bg-[#290000]/85': notification.type === NotificationType.Error,
        'bg-[#0B3800]/85': notification.type === NotificationType.Success,
        'bg-[#002857]/85': notification.type === NotificationType.Info,
        'bg-black/85': notification.type === NotificationType.Warning,
>>>>>>> Stashed changes
      }"
      :style="[
        notification.type === NotificationType.Warning && {
          'background-image': `url(${asset('assets/notifications/warning-background.svg')})`,
          backgroundRepeat: 'repeat',
        },
      ]"
    >
      <div class="shrink-0">
        <div
          class="flex items-center justify-center text-xs border rounded h-14 w-14"
          :class="{
<<<<<<< Updated upstream
            'border-[#FF2431]/15 text-[#FF2431] bg-[#FF2431]/5': props.notification.type === NotificationType.Error,
            'border-[#A1D631]/15 text-[#A1D631] bg-[#A1D631]/5': props.notification.type === NotificationType.Success,
            'border-[#2087FF]/15 text-[#2087FF] bg-[#2087FF]/5': props.notification.type === NotificationType.Info,
            'border-[#F2CB40]/15 text-[#F2CB40] bg-[#F2CB40]/5': props.notification.type === NotificationType.Warning,
          }"
        >
          <div class="w-[22px] h-[22px]">
            <template v-if="props.notification.type === NotificationType.Error">
              <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6H12V13H10V6ZM10 14H12V16H10V14Z" fill="currentColor"/>
                <path d="M20.707 6.293L15.707 1.293C15.6143 1.19996 15.5041 1.12617 15.3828 1.07589C15.2614 1.0256 15.1313 0.999811 15 1H7C6.86866 0.999811 6.73857 1.0256 6.61724 1.07589C6.4959 1.12617 6.38571 1.19996 6.293 1.293L1.293 6.293C1.19996 6.38571 1.12617 6.4959 1.07589 6.61724C1.0256 6.73857 0.999811 6.86866 1 7V15C1 15.266 1.105 15.52 1.293 15.707L6.293 20.707C6.38571 20.8 6.4959 20.8738 6.61724 20.9241C6.73857 20.9744 6.86866 21.0002 7 21H15C15.266 21 15.52 20.895 15.707 20.707L20.707 15.707C20.8 15.6143 20.8738 15.5041 20.9241 15.3828C20.9744 15.2614 21.0002 15.1313 21 15V7C21.0002 6.86866 20.9744 6.73857 20.9241 6.61724C20.8738 6.4959 20.8 6.38571 20.707 6.293ZM19 14.586L14.586 19H7.414L3 14.586V7.414L7.414 3H14.586L19 7.414V14.586Z" fill="currentColor"/>
              </svg>
            </template>

            <template v-if="props.notification.type === NotificationType.Success">
              <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.17157 1.17157C0.421427 1.92172 0 2.93913 0 4V18C0 19.0609 0.421427 20.0783 1.17157 20.8284C1.92172 21.5786 2.93913 22 4 22H18C19.0609 22 20.0783 21.5786 20.8284 20.8284C21.5786 20.0783 22 19.0609 22 18V4C22 2.93913 21.5786 1.92172 20.8284 1.17157C20.0783 0.421427 19.0609 0 18 0H4C2.93913 0 1.92172 0.421427 1.17157 1.17157ZM18 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V4C20 3.46957 19.7893 2.96086 19.4142 2.58579C19.0391 2.21071 18.5304 2 18 2ZM5 11.0701L9.243 15.3141L16.314 8.24215L14.899 6.82715L9.243 12.4841L6.414 9.65615L5 11.0701Z" fill="currentColor"/>
              </svg>
            </template>

            <template v-if="props.notification.type === NotificationType.Info">
              <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.032 1C14.372 1 15.042 1.912 15.042 2.957C15.042 4.262 13.878 5.469 12.363 5.469C11.094 5.469 10.354 4.719 10.389 3.479C10.389 2.436 11.27 1 13.032 1ZM8.909 21C7.851 21 7.076 20.348 7.816 17.476L9.03 12.384C9.241 11.57 9.276 11.243 9.03 11.243C8.713 11.243 7.341 11.805 6.528 12.36L6 11.48C8.572 9.294 11.531 8.013 12.801 8.013C13.858 8.013 14.034 9.286 13.506 11.243L12.115 16.595C11.869 17.54 11.974 17.866 12.221 17.866C12.538 17.866 13.578 17.474 14.6 16.659L15.2 17.473C12.698 20.02 9.965 21 8.909 21Z" fill="currentColor"/>
              </svg>
            </template>

            <template v-if="props.notification.type === NotificationType.Warning">
              <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.754 16.374L13.1864 3.23168C12.9672 2.85681 12.6536 2.54587 12.277 2.32978C11.9003 2.1137 11.4736 2 11.0394 2C10.6051 2 10.1785 2.1137 9.8018 2.32978C9.42513 2.54587 9.11161 2.85681 8.89241 3.23168L1.32478 16.374C1.11209 16.7378 1 17.1516 1 17.573C1 17.9944 1.11209 18.4082 1.32478 18.7719C1.54155 19.1487 1.85464 19.4609 2.23193 19.6767C2.60922 19.8925 3.03713 20.0041 3.47176 19.9999H18.607C19.0414 20.0038 19.4689 19.8921 19.8459 19.6763C20.2228 19.4605 20.5356 19.1484 20.7523 18.7719C20.9652 18.4083 21.0776 17.9946 21.0779 17.5732C21.0782 17.1518 20.9664 16.7379 20.754 16.374ZM18.954 17.7326C18.9188 17.7926 18.8681 17.8419 18.8072 17.8755C18.7462 17.909 18.6774 17.9254 18.6079 17.923H3.47176C3.40226 17.9254 3.33341 17.909 3.27248 17.8755C3.21155 17.8419 3.16081 17.7926 3.12561 17.7326C3.09576 17.6841 3.07995 17.6282 3.07995 17.5712C3.07995 17.5143 3.09576 17.4584 3.12561 17.4098L10.6932 4.26752C10.7307 4.20984 10.782 4.16244 10.8425 4.12963C10.9029 4.09681 10.9706 4.07962 11.0394 4.07962C11.1082 4.07962 11.1759 4.09681 11.2363 4.12963C11.2968 4.16244 11.3481 4.20984 11.3855 4.26752L18.9523 17.4098C18.9824 17.4582 18.9985 17.514 18.9988 17.571C18.9991 17.628 18.9836 17.6839 18.954 17.7326ZM10.0009 12.0385V9.26934C10.0009 8.99393 10.1104 8.7298 10.3051 8.53505C10.4998 8.34031 10.764 8.2309 11.0394 8.2309C11.3148 8.2309 11.5789 8.34031 11.7737 8.53505C11.9684 8.7298 12.0778 8.99393 12.0778 9.26934V12.0385C12.0778 12.3139 11.9684 12.5781 11.7737 12.7728C11.5789 12.9675 11.3148 13.077 11.0394 13.077C10.764 13.077 10.4998 12.9675 10.3051 12.7728C10.1104 12.5781 10.0009 12.3139 10.0009 12.0385ZM12.424 15.5C12.424 15.7738 12.3428 16.0415 12.1906 16.2692C12.0385 16.4969 11.8222 16.6744 11.5692 16.7792C11.3162 16.884 11.0379 16.9114 10.7693 16.858C10.5007 16.8045 10.254 16.6727 10.0603 16.479C9.8667 16.2854 9.73483 16.0387 9.68141 15.7701C9.62798 15.5015 9.6554 15.2231 9.7602 14.9701C9.86499 14.7171 10.0425 14.5009 10.2702 14.3487C10.4978 14.1966 10.7655 14.1154 11.0394 14.1154C11.4066 14.1154 11.7588 14.2613 12.0184 14.5209C12.2781 14.7806 12.424 15.1328 12.424 15.5Z" fill="currentColor"/>
              </svg>
            </template>
          </div>
        </div>
      </div>
      <div class="grid gap-1">
        <div class="leading-none">
          <div
            class="p-1 rounded inline-flex text-[12px] font-bold uppercase leading-none"
            :class="{
              'bg-[#FF2431]': props.notification.type === NotificationType.Error,
              'bg-[#A1D631]': props.notification.type === NotificationType.Success,
              'bg-[#2087FF]': props.notification.type === NotificationType.Info,
              'bg-[#F2CB40] text-black': props.notification.type === NotificationType.Warning, 
            }"
          >{{ props.notification.type }}</div>
        </div>
        <div class="text-base font-bold leading-tight">{{ props.notification.text }}</div>
=======
            'border-[#FF24311F]': notification.type === NotificationType.Error,
            'border-[#A3DF221F]': notification.type === NotificationType.Success,
            'border-[#2087FF1F]': notification.type === NotificationType.Info,
            'border-[#F2CB401F] bg-[#252210]': notification.type === NotificationType.Warning,
          }"
        >
          <Icon
            :name="`notification-${notification.type}`"
            :size="notification.type === NotificationType.Info ? 11 : 22"
            :class="{
              '-mt-2': notification.type === NotificationType.Info,
            }"
          />
        </div>
      </div>
      <div class="grid gap-1">
        <div class="text-lg font-semibold leading-tight">{{ notification.text }}</div>
>>>>>>> Stashed changes
      </div>
      <img
        v-if="notification.type === NotificationType.Error"
        :src="asset('assets/notifications/error-x.svg')"
        class="absolute bottom-0.5 right-3.5 h-13.5 w-13.5"
      />
      <img
        v-if="notification.type === NotificationType.Success"
        :src="asset('assets/notifications/success-check.svg')"
        class="absolute bottom-2 right-3 h-13.75 w-19.25"
      />
    </div>
  </div>
</template>
