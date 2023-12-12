<template>
  <VAppBar flat density="comfortable">
    <VAppBarNavIcon @click="drawerModel = !drawerModel" />
    <VAppBarTitle>
      <VIcon icon="mdi-circle-slice-6" />
      LENS <small>playground</small>
    </VAppBarTitle>
  </VAppBar>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core';

const props = defineProps<{
  isDrawerOpened: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:isDrawerOpened', value: boolean): void;
}>();

const drawerModel = useVModel(props, 'isDrawerOpened', emit);
</script>
