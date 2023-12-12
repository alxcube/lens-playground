<template>
  <VAppBar flat density="comfortable">
    <VAppBarNavIcon @click="drawerModel = !drawerModel" />
    <RouterLink :to="{ name: 'Home' }">
      <VImg src="@/assets/lens-logo-96x96.png" width="48" height="48" />
    </RouterLink>
    <VAppBarTitle> LENS <small>playground</small> </VAppBarTitle>

    <VSpacer />

    <VBtn icon>
      <VIcon>mdi-dots-vertical</VIcon>
      <VMenu activator="parent">
        <VList>
          <VListItem>
            <VSwitch
              label="Dark theme"
              v-model="isDarkTheme"
              true-icon="mdi-weather-night"
              false-icon="mdi-white-balance-sunny"
              prepend-icon="mdi-theme-light-dark"
            />
          </VListItem>
        </VList>
      </VMenu>
    </VBtn>
  </VAppBar>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';
import { useVModel } from '@vueuse/core';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  isDrawerOpened: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:isDrawerOpened', value: boolean): void;
}>();

const drawerModel = useVModel(props, 'isDrawerOpened', emit);

const { isDarkTheme } = storeToRefs(useAppStore());
</script>
