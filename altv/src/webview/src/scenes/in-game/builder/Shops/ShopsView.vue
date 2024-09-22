<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ShopForm from "./ShopForm.vue";
import ShopsList from "./ShopsList.vue";

const isFormOpen = ref(false);

type ShopData = {
  name: string;
  inventory: {
    items: {
      key: string;
      price: number;
    }[];
    size: number;
  }
  ped: {
    model: string;
    pos: {
      x: number;
      y: number;
      z: number;
    }
    heading: number;
  }
}

// global list of shops ordered by distance?
// search by name/location/item
// create/edit/delete shop
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Shop</CardTitle>
      <CardDescription>
        Shops are places where players can buy items.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ShopForm v-if="isFormOpen" />
      <ShopsList
        v-else
        @create="() => (isFormOpen = true)"
      />
    </CardContent>
  </Card>
</template>
