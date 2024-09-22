<script setup lang="ts">
import { MoreHorizontal } from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

defineProps<{
  shop: {
    id: string;
  };
}>();

defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
}>();

function copy(id: string) {
  navigator.clipboard.writeText(id);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="h-8 w-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <!-- <DropdownMenuItem @click="copy(shop.id)">Duplicate</DropdownMenuItem> -->
      <DropdownMenuItem @click="$emit('edit', shop.id)">Edit world event</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        @click="$emit('delete', shop.id)"
        class="text-destructive"
      >
        Delete world event
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
