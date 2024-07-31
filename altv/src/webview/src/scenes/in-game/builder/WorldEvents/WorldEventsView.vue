<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WorldEventForm from "./WorldEventForm.vue";
import WorldEventsList from "./WorldEventsList.vue";

const isFormOpen = ref(false);
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>World Events</CardTitle>
      <CardDescription>
        World events include anything happening periodically in the game.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <WorldEventForm v-if="isFormOpen" />
      <WorldEventsList
        v-else
        @create="() => (isFormOpen = true)"
      />
    </CardContent>
  </Card>
</template>
