<script setup lang="ts">
import { ref } from "vue";
import { Loader2 } from "lucide-vue-next";
import { WebviewEvents } from "@shared/events/webview";
import { useAlt } from "@/composables/use-alt";
import Screen from "@/components/Screen.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const { on } = useAlt();

const authUrl = ref<string>(window.altMock ? "#auth-url" : "");
const loading = ref(false);

on(WebviewEvents.FromClient.SETUP_DISCORD_AUTH, (url: string) => {
  authUrl.value = url;
});

function beginAuth() {
  loading.value = true;
  setTimeout(() => {
    window.open(authUrl.value);
    // Consider setting loading back to false after the window opens or fails
    // loading.value = false;
  }, 1000);
}
</script>

<template>
  <Screen class="flex items-center justify-center">
    <transition name="fade">
      <Card
        v-if="authUrl"
        class="w-[350px]"
      >
        <CardContent class="flex justify-center p-6">
          <Button
            @click="beginAuth"
            :disabled="loading"
          >
            <transition
              name="fade"
              mode="out-in"
            >
              <Loader2
                v-if="loading"
                class="mr-2 h-4 w-4 animate-spin"
              />
              <span v-else>Login with Discord</span>
            </transition>
            <span v-if="!loading && loading !== null">Login with Discord</span>
            <!-- Display text only when not loading -->
          </Button>
        </CardContent>
      </Card>
    </transition>
  </Screen>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
