<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Card from "@/components/ui/card/Card.vue";
import { cn } from "@/lib/utils";
import WorldEventsView from "./WorldEvents/WorldEventsView.vue";
import { useEventListener } from "@/composables/use-event-listener";

enum View {
  WorldEvents = "WorldEvents",
  Shops = "Shops",
  RandomLoot = "RandomLoot",
  AirDrops = "AirDrops",
}

const VIEWS = [
  {
    key: View.WorldEvents,
    label: "World Events",
  },
  {
    key: View.Shops,
    label: "Shops",
  },
  {
    key: View.RandomLoot,
    label: "Random Loot",
  },
  {
    key: View.AirDrops,
    label: "Air Drops",
  },
];

const currentView = ref<View>();

// left click
useEventListener('click', (event) => {
  if (event.button === 0) {
    console.log('left click')
  }
});

// right click
useEventListener('contextmenu', (event) => {
  if (event.button === 2) {
    console.log('right click')
  }
});
</script>

<template>
  <div class="flex h-full w-full flex-col items-end justify-end p-10">
    <div class="mb-2">
      <WorldEventsView v-if="currentView === View.WorldEvents" />
    </div>
    <Card>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem
            v-for="view in VIEWS"
            :key="view.key"
          >
            <NavigationMenuLink
              @select="
                () => {
                  if (currentView === view.key) {
                    currentView = undefined;
                  } else {
                    currentView = view.key;
                  }
                }
              "
              :active="currentView === view.key"
              :class="cn(navigationMenuTriggerStyle(), { 'font-bold': currentView === view.key })"
            >
              {{ view.label }}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </Card>
  </div>
</template>
