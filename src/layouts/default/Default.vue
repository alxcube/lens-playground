<template>
  <VApp theme="dark">
    <DefaultBar />

    <DefaultView />

    <VFooter app>
      <span class="text-body-2"> &copy; 2020-2023 Alexander Alexandrov (alxcube) </span>
    </VFooter>

    <GlobalMessage :default-timeout="5000" />

    <VOverlay class="d-flex align-center justify-center" :model-value="isLoading" persistent>
      <VProgressCircular indeterminate size="100" />
    </VOverlay>
  </VApp>
</template>

<script lang="ts" setup>
import GlobalMessage from '@/components/GlobalMessage';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import DefaultBar from './AppBar.vue';
import DefaultView from './View.vue';
const { isLoading } = storeToRefs(useAppStore());
</script>
