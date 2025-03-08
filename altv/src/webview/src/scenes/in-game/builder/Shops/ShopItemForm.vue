<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
import {
  getItemProperties,
  isItemKeyAmmo,
  isItemKeyClothing,
  isItemKeyConsumable,
  isItemKeyFirearmWeapon,
  isItemKeyFishingBait,
  isItemKeyMaterial,
  isItemKeyMeleeWeapon,
  isItemKeyThrowableWeapon,
  isItemKeyTool,
  isItemKeyWeaponComponent,
  ItemGrade,
  ITEMS_REGISTRY,
} from "@shared/modules/items";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VirtualScrollSelect from "@/components/VirtualScrollSelect.vue";

const ITEMS = Array.from(ITEMS_REGISTRY.values()).map((item) => ({
  value: item.key,
  label: item.name || item.key,
}));

function getItemIcon(itemKey: string) {
  if (isItemKeyFirearmWeapon(itemKey)) {
    return "game-icons:pistol-gun";
  } else if (isItemKeyThrowableWeapon(itemKey)) {
    return "game-icons:stun-grenade";
  } else if (isItemKeyMeleeWeapon(itemKey)) {
    return "game-icons:baseball-bat";
  } else if (isItemKeyAmmo(itemKey)) {
    return "game-icons:machine-gun-magazine";
  } else if (isItemKeyConsumable(itemKey)) {
    return "game-icons:pill";
  } else if (isItemKeyClothing(itemKey)) {
    return "game-icons:t-shirt";
  } else if (isItemKeyMaterial(itemKey)) {
    return "game-icons:materials-science";
  } else if (isItemKeyTool(itemKey)) {
    return "game-icons:hammer-nails";
  } else if (isItemKeyFishingBait(itemKey)) {
    return "game-icons:fishing-hook";
  } else if (isItemKeyWeaponComponent(itemKey)) {
    return "mdi:cog";
  } else {
    return "game-icons:question-mark";
  }
}

const emit = defineEmits<{
  (
    e: "add-item",
    item: {
      key: string;
      price: number;
      grade?: string;
    },
  ): void;
}>();

const validationSchema = toTypedSchema(
  z.object({
    key: z.string(),
    price: z.number(),
    grade: z.string().optional(),
  }),
);

const form = useForm({
  validationSchema,
  initialValues: {
    key: "",
    price: 0,
    grade: undefined,
  },
});

const valid = computed(
  () =>
    form.values.key &&
    form.values.price &&
    (form.values.grade || !getItemProperties(form.values.key).includes("grade")),
);

function addItem() {
  if (!form.values.key || !form.values.price) {
    console.error("Invalid form values");
    return;
  }

  console.log(form.values);
  emit("add-item", {
    key: form.values.key,
    price: form.values.price,
    ...(getItemProperties(form.values.key).includes("grade") ? { grade: form.values.grade } : {}),
  });
}
</script>

<template>
  <form @submit="addItem">
    <div class="flex flex-col gap-2">
      <!-- Item -->
      <FormField
        v-slot="{ componentField }"
        name="key"
      >
        <FormItem>
          <FormLabel>Item</FormLabel>
          <FormControl>
            <VirtualScrollSelect
              v-bind="componentField"
              :items="ITEMS"
              v-slot="{ option }"
            >
              <span class="overflow-hidden text-ellipsis whitespace-nowrap">
                <Icon
                  :icon="getItemIcon(option.value)"
                  class="mr-1 inline"
                />
                {{ option.label }}
              </span>
            </VirtualScrollSelect>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="flex gap-2">
        <!-- Price -->
        <FormField
          v-slot="{ componentField }"
          name="price"
        >
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="number"
                placeholder="Price"
                class="w-24"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Grade -->
        <FormField
          v-if="getItemProperties(form.values.key!).includes('grade')"
          v-slot="{ componentField }"
          name="grade"
        >
          <FormItem>
            <FormLabel>Grade</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select"
                    class="capitalize"
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem
                    v-for="type in Object.values(ItemGrade)"
                    :key="type"
                    :value="type"
                    class="capitalize"
                  >
                    {{ type }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <Button
        class="mt-4"
        type="button"
        @click="addItem"
        :disabled="!valid"
      >
        Add
      </Button>
    </div>
  </form>
</template>
