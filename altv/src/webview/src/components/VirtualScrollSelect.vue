<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Icon } from "@iconify/vue";
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverAnchor,
  PopoverRoot,
  PopoverTrigger,
  ListboxContent,
  ListboxVirtualizer,
  ListboxItem,
  ListboxItemIndicator,
  ListboxRoot,
  ListboxFilter,
} from "radix-vue";
import { Check } from "lucide-vue-next";
import { px } from "@/composables/use-pixel";
import { Input } from "./ui/input";

const props = defineProps<{
  items: { value: string; label: string }[];
}>();

const model = defineModel<string>();

const searchTerm = ref("");
const open = ref(false);

const selectedLabel = computed(() => {
  return props.items.find((item) => item.value === model.value)?.label;
});

const filteredItems = computed(() =>
  searchTerm.value === ""
    ? props.items
    : props.items.filter((item) => {
        return item.label.toLowerCase().includes(searchTerm.value.toLowerCase());
      }),
);

watch(model, () => {
  open.value = false;
});

watch(searchTerm, (f) => {
  if (f) {
    open.value = true;
  }
  console.log(filteredItems.value.length);
});
</script>

<template>
  <PopoverRoot v-model:open="open">
    <ListboxRoot v-model="model">
      <PopoverAnchor
        class="text-grass11 hover:bg-mauve3 inline-flex w-60 items-center justify-between gap-[5px] rounded-lg bg-neutral-900 p-3 text-[13px] leading-none shadow-[0_2px_10px] shadow-black/10 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-white"
      >
        <PopoverTrigger
          class="flex w-full items-center justify-between"
          tabindex="-1"
        >
          <ListboxFilter
            v-model="searchTerm"
            as-child
          >
            <span>{{ selectedLabel }}</span>
          </ListboxFilter>
          <Icon
            tabindex="-1"
            icon="radix-icons:chevron-down"
            class="h-4 w-4"
          />
        </PopoverTrigger>
      </PopoverAnchor>

      <PopoverPortal>
        <PopoverContent
          @openAutoFocus.prevent
          side="bottom"
          :side-offset="5"
          class="data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade w-auto rounded bg-neutral-900 pl-2 pr-0.5 pt-2 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)]"
        >
          <Input
            v-model="searchTerm"
            class="mb-2 w-4/5"
            placeholder="Search..."
            @keydown.enter.prevent
          />
          <ListboxContent class="scrollbar-white scrollbar-vertical h-64 w-60 overflow-auto pr-2">
            <ListboxVirtualizer
              v-slot="{ option }"
              :options="filteredItems"
              :text-content="(opt: any) => opt.label"
              :estimate-size="px(32)"
            >
              <ListboxItem
                :value="option.value"
                class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:cursor-pointer hover:bg-neutral-700 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                  <ListboxItemIndicator>
                    <Check class="h-4 w-4" />
                  </ListboxItemIndicator>
                </span>
                <slot :option="option" />
              </ListboxItem>
            </ListboxVirtualizer>
          </ListboxContent>

          <PopoverClose
            class="text-grass11 hover:bg-green4 absolute right-1.25 top-1.25 inline-flex h-6.25 w-6.25 items-center justify-center rounded-full outline-none focus:shadow-[0_0_0_2px] focus:shadow-white"
            aria-label="Close"
          >
            <Icon icon="radix-icons:cross-2" />
          </PopoverClose>
          <PopoverArrow class="fill-neutral-900" />
        </PopoverContent>
      </PopoverPortal>
    </ListboxRoot>
  </PopoverRoot>
</template>
