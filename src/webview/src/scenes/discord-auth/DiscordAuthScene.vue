<script setup lang="ts">
import { ref } from "vue";
import { useAlt } from "@/composables/use-alt";
import Screen from "@/components/Screen.vue";

const { on } = useAlt();

const authUrl = ref<string>(window.altMock ? "#auth-url" : "");
const loading = ref(false);

on(Events.Webview.SETUP_DISCORD_AUTH, (url: string) => {
  authUrl.value = url;
});

function beginAuth() {
  loading.value = true;
  setTimeout(() => {
    window.open(authUrl.value);
  }, 1000);
}
</script>

<template>
  <Screen class="flex justify-center items-center">
    <v-fade-transition>
      <v-card v-if="authUrl">
        <v-card-text>
          <v-btn @click="beginAuth">
            <template #prepend>
              <v-fade-transition>
                <v-progress-circular
                  v-if="loading"
                  size="small"
                  indeterminate
                />
              </v-fade-transition>
            </template>
            Login with Discord
          </v-btn>
        </v-card-text>
      </v-card>
    </v-fade-transition>
  </Screen>
</template>
