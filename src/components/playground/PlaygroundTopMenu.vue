<script setup lang="ts">
import { usePlaygroundStore } from '@/store/playground';
import { storeToRefs } from 'pinia';

const playgroundStore = usePlaygroundStore();
const { isShowInputSettingsDialog, isShowOutputInfoDialog } = storeToRefs(playgroundStore);
</script>

<template>
  <VBtn icon>
    <VIcon>mdi-dots-vertical</VIcon>
    <VMenu activator="parent">
      <VList>
        <VListItem @click="isShowInputSettingsDialog = true">Input Settings</VListItem>
        <VListItem @click="isShowOutputInfoDialog = true">Output Info</VListItem>
      </VList>
    </VMenu>
  </VBtn>
</template>

<style scoped></style>
